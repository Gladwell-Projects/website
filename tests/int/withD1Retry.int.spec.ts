import { describe, it, expect } from 'vitest'
import { withD1Retry } from '@/utilities/withD1Retry'

// Minimal stand-in for the D1 binding surface the adapter/drizzle touches:
// db.prepare(sql).bind(...).all()/run()/raw()/first(), plus withSession().
type Outcome = { kind: 'ok'; value: unknown } | { kind: 'throw'; error: unknown }

const socketError = () => {
  const inner = Object.assign(new Error('other side closed'), { code: 'UND_ERR_SOCKET' })
  return Object.assign(new TypeError('fetch failed'), { cause: inner })
}

// A fake statement whose terminal call yields the next queued outcome and counts attempts.
const makeStmt = (sql: string, outcomes: Outcome[], counter: { sql: string; calls: number }[]) => {
  const rec = { sql, calls: 0 }
  counter.push(rec)
  const run = async () => {
    const outcome = outcomes[Math.min(rec.calls, outcomes.length - 1)]
    rec.calls++
    if (outcome.kind === 'throw') throw outcome.error
    return outcome.value
  }
  const stmt = {
    bind: (..._args: unknown[]) => stmt, // chainable, same statement
    all: run,
    run,
    raw: run,
    first: run,
  }
  return stmt
}

const makeDb = (plan: Record<string, Outcome[]>, counter: { sql: string; calls: number }[]) => ({
  prepare: (sql: string) => makeStmt(sql, plan[sql] ?? [{ kind: 'ok', value: 'default' }], counter),
  withSession: (_constraint: string) => makeDb(plan, counter),
})

describe('withD1Retry', () => {
  it('retries a transient socket failure on a read and eventually succeeds', async () => {
    const counter: { sql: string; calls: number }[] = []
    const db = withD1Retry(
      makeDb(
        {
          'select * from pages': [
            { kind: 'throw', error: socketError() },
            { kind: 'throw', error: socketError() },
            { kind: 'ok', value: 'rows' },
          ],
        },
        counter,
      ),
    )

    const result = await db.prepare('select * from pages').bind(1).all()
    expect(result).toBe('rows')
    expect(counter[0].calls).toBe(3) // two failures + one success
  })

  it('does NOT retry a write, even on a transient error', async () => {
    const counter: { sql: string; calls: number }[] = []
    const db = withD1Retry(
      makeDb({ 'update pages set x = 1': [{ kind: 'throw', error: socketError() }] }, counter),
    )

    await expect(db.prepare('update pages set x = 1').run()).rejects.toMatchObject({
      message: 'fetch failed',
    })
    expect(counter[0].calls).toBe(1) // no retry for writes
  })

  it('does NOT retry a non-transient error on a read (e.g. real SQL error)', async () => {
    const counter: { sql: string; calls: number }[] = []
    const db = withD1Retry(
      makeDb(
        { 'select 1': [{ kind: 'throw', error: new Error('no such table: pages') }] },
        counter,
      ),
    )

    await expect(db.prepare('select 1').all()).rejects.toThrow('no such table')
    expect(counter[0].calls).toBe(1)
  })

  it('gives up after the attempt cap and rethrows the transient error', async () => {
    const counter: { sql: string; calls: number }[] = []
    const db = withD1Retry(
      makeDb({ 'select 2': [{ kind: 'throw', error: socketError() }] }, counter),
    )

    await expect(db.prepare('select 2').all()).rejects.toMatchObject({ message: 'fetch failed' })
    expect(counter[0].calls).toBe(3) // capped at 3 attempts
  })

  it('applies retry through withSession() read paths too', async () => {
    const counter: { sql: string; calls: number }[] = []
    const db = withD1Retry(
      makeDb(
        {
          'select * from media': [
            { kind: 'throw', error: socketError() },
            { kind: 'ok', value: 'media-rows' },
          ],
        },
        counter,
      ),
    )

    const result = await db.withSession('first-primary').prepare('select * from media').all()
    expect(result).toBe('media-rows')
    expect(counter[0].calls).toBe(2)
  })
})
