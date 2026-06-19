/**
 * Build-time resilience wrapper for the D1 binding.
 *
 * During `next build` the static export prerenders every page, and the
 * `@payloadcms/db-d1-sqlite` adapter has no local Worker — so each Payload query
 * runs against *remote* D1 over the beta remote-bindings HTTP proxy
 * (`getCloudflareContext` / `getPlatformProxy` with `experimental.remoteBindings`).
 * That proxy has no retry, so an occasional dropped keep-alive surfaces as
 * `TypeError: fetch failed` → `UND_ERR_SOCKET: other side closed` and fails the
 * entire export (a different page each run). Neither Payload nor the adapter
 * retries this — it's a transport-layer flake one level below them.
 *
 * This wraps the binding so transient socket failures on *read* queries are
 * retried with a short backoff. Only read-only statements (SELECT/WITH/PRAGMA/
 * EXPLAIN) are retried, mirroring D1's own server-side read-retry policy, so a
 * write that may have partially applied is never silently re-run.
 *
 * Intended for BUILD-time use only (see `payload.config.ts`): at Worker runtime
 * D1 is a native, in-colo binding with no HTTP hop, so the wrapper is not
 * applied there and writes/`batch` keep their native statement objects.
 */

const TRANSIENT = /UND_ERR_SOCKET|other side closed|fetch failed|ECONNRESET|socket hang up|terminated/i
const READONLY = /^\s*(?:select|with|pragma|explain)\b/i
const TERMINAL = new Set(['all', 'run', 'raw', 'first'])

const isTransient = (err: unknown): boolean => {
  for (let cur = err as { code?: unknown; message?: unknown; cause?: unknown } | null | undefined; cur != null; cur = cur.cause as typeof cur) {
    if (TRANSIENT.test(`${cur.code ?? ''} ${cur.message ?? ''}`)) return true
  }
  return false
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const retry = async <T>(op: () => Promise<T>, attempts = 3): Promise<T> => {
  for (let attempt = 1; ; attempt++) {
    try {
      return await op()
    } catch (err) {
      if (attempt >= attempts || !isTransient(err)) throw err
      await sleep(150 * attempt)
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
        return (...args: any[]) => retry(() => value.apply(target, args))
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

/** Wrap a D1 binding so transient socket failures on read queries are retried. */
export const withD1Retry = <T>(binding: T): T => wrapDatabase(binding)
