/**
 * Build-time resilience wrapper for the D1 binding.
 *
 * During `next build` the static export prerenders every page, and the
 * `@payloadcms/db-d1-sqlite` adapter has no local Worker — so each Payload query
 * runs against *remote* D1 over the beta remote-bindings HTTP proxy
 * (`getCloudflareContext` / `getPlatformProxy` with `experimental.remoteBindings`).
 * That proxy has no retry, and the remote D1 HTTP path fails transiently in more
 * than one way under the hundreds of queries a build fires:
 *   - dropped keep-alive  → `TypeError: fetch failed` / `UND_ERR_SOCKET: other side closed`
 *   - a 5xx from the edge → `D1_ERROR: Failed to parse body as JSON, got: <!DOCTYPE html> …`
 *     (Cloudflare "Temporarily unavailable" error page returned instead of JSON)
 * Any one of these on any page aborts the whole export. Neither Payload nor the
 * adapter retries them — they're infra flakes one level below.
 *
 * Rather than enumerate every transient signature (we've already been bitten by
 * two), this retries *any* failure on a read query. That's safe because reads
 * are idempotent and this wrapper is BUILD-time only (see `payload.config.ts`):
 * only read-only statements (SELECT/WITH/PRAGMA/EXPLAIN) are retried, so a write
 * that may have partially applied is never silently re-run. At Worker runtime D1
 * is a native, in-colo binding with no HTTP hop, so the wrapper is not applied
 * there and writes/`batch` keep their native statement objects.
 */

const READONLY = /^\s*(?:select|with|pragma|explain)\b/i
const TERMINAL = new Set(['all', 'run', 'raw', 'first'])

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Retry an idempotent read on ANY error — at build time every failure here is a
// transient remote-D1 hiccup, and retrying a deterministic error just fails
// again after the cap with the original error surfaced.
const retryRead = async <T>(op: () => Promise<T>, attempts = 4): Promise<T> => {
  for (let attempt = 1; ; attempt++) {
    try {
      return await op()
    } catch (err) {
      if (attempt >= attempts) throw err
      const message = err instanceof Error ? err.message : String(err)
      console.warn(`[d1] build read failed (attempt ${attempt}/${attempts}), retrying: ${message.slice(0, 140)}`)
      await sleep(250 * attempt)
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const wrapStatement = (stmt: any, retryable: boolean): any =>
  new Proxy(stmt, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver)
      if (typeof value !== 'function') return value
      // `bind` chains into another prepared statement — keep wrapping it.
      if (prop === 'bind') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (...args: any[]) => wrapStatement(value.apply(target, args), retryable)
      }
      if (retryable && typeof prop === 'string' && TERMINAL.has(prop)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (...args: any[]) => retryRead(() => value.apply(target, args))
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (...args: any[]) => value.apply(target, args)
    },
  })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const wrapDatabase = (db: any): any =>
  new Proxy(db, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver)
      if (typeof value !== 'function') return value
      if (prop === 'prepare') {
        return (sql: string) => wrapStatement(value.call(target, sql), READONLY.test(sql ?? ''))
      }
      // `withSession(...)` (used by readReplicas) returns another query surface.
      if (prop === 'withSession') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (...args: any[]) => wrapDatabase(value.apply(target, args))
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (...args: any[]) => value.apply(target, args)
    },
  })

/** Wrap a D1 binding so transient failures on read queries are retried (build-time). */
export const withD1Retry = <T>(binding: T): T => wrapDatabase(binding)
