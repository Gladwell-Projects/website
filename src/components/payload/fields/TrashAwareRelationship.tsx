'use client'

import { EditIcon, ReactSelect, useField, WarningIcon, XIcon } from '@payloadcms/ui'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/** One referenced doc resolved for a list row. */
type Item = { id: string; title: string; trashed: boolean }

/** A `react-select` option (`{ value, label }`). */
type Option = { value: string; label: string }

/** Shape of a related doc returned by REST (only the fields we read). */
type Doc = { id: string | number; title?: string; deletedAt?: string | null }

/** The Payload field-component props we rely on. */
type Props = {
  path: string
  field?: {
    name?: string
    label?: unknown
    relationTo?: string | string[]
    hasMany?: boolean
  }
}

/** `"relatedArtists"` → `"Related Artists"`. */
const humanize = (name?: string): string =>
  (name ?? 'Items').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (char) => char.toUpperCase())

/**
 * Trash-aware list UI for a `hasMany` relationship to a trash-enabled collection.
 *
 * Generalizes the original featuredArtists field. Payload populates a
 * relationship with `find({ trash: false })`, so a trashed-but-still-referenced
 * doc is dropped from the populate and renders as "untitled" — with no per-field
 * option to include it or relabel the chip. This component owns the value via
 * `useField`, resolves the SELECTED docs by id (including trashed), and renders
 * them as rows: title on the left (trashed ones flagged with a warning),
 * Edit/Remove on the right, plus a bounded server-side search to add. It reads
 * `relationTo` / `hasMany` / `label` from the field config, so ONE component
 * serves every such relationship — wire it via the field's `admin.components.Field`.
 *
 * Assumptions (guarded — renders an error instead of misbehaving silently):
 *   - monomorphic `hasMany` (value is a flat id array);
 *   - the target collection's `useAsTitle` is `title` (true for every current
 *     target: artists, exhibitions). A different title field would resolve as
 *     "Untitled" until a `titleField` prop is added.
 *
 * ⚠️ PAYLOAD-UPGRADE FRAGILITY — recheck on every `@payloadcms/*` bump:
 *   - depends on `useField` + `ReactSelect` exports from `@payloadcms/ui`;
 *   - assumes the REST `?trash=true` param, `where[title][like]` search, and
 *     `find`'s default `trash: false` (the reason natives show "untitled").
 *   If trashed docs resolve fine in the native relationship after an upgrade,
 *   this component can likely be deleted everywhere it's wired.
 *
 * @param {Props} props - Payload field props (`path`, `field`).
 * @returns {JSX.Element}
 */
const TrashAwareRelationship: React.FC<Props> = ({ path, field }) => {
  const relationTo = typeof field?.relationTo === 'string' ? field.relationTo : undefined
  const label = typeof field?.label === 'string' ? field.label : humanize(field?.name)
  const apiBase = relationTo ? `/api/${relationTo}` : null

  const { value, setValue } = useField<(string | number)[]>({ path })
  const ids = useMemo(() => (Array.isArray(value) ? value.map(String) : []), [value])
  const idsKey = ids.join(',')

  /**
   * Resolved details for the SELECTED docs only (incl. trashed). Fetched by id —
   * never the whole collection — so it stays cheap as the target grows into the
   * hundreds+. Only initially-loaded ids (and trashed ones) hit the network;
   * docs added via the search already carry their title (see onAdd).
   */
  const [resolved, setResolved] = useState<Record<string, Item>>({})
  useEffect(() => {
    if (!apiBase) return
    const missing = ids.filter((id) => !resolved[id])
    if (missing.length === 0) return
    let active = true
    const query = missing.map((id, i) => `where[id][in][${i}]=${encodeURIComponent(id)}`).join('&')

    fetch(`${apiBase}?${query}&trash=true&depth=0&limit=200`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : { docs: [] as Doc[] }))
      .then((data: { docs?: Doc[] }) => {
        if (!active) return
        setResolved((prev) => {
          const next = { ...prev }
          for (const doc of data.docs ?? []) {
            next[String(doc.id)] = {
              id: String(doc.id),
              title: doc.title || 'Untitled',
              trashed: Boolean(doc.deletedAt),
            }
          }
          for (const id of missing) if (!next[id]) next[id] = { id, title: 'Unknown', trashed: false }
          return next
        })
      })
      .catch(() => {})

    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed by idsKey to avoid array-identity churn
  }, [idsKey, apiBase])

  const remove = useCallback(
    (id: string) => setValue(ids.filter((existing) => existing !== id)),
    [ids, setValue],
  )

  const onAdd = useCallback(
    (option: Option | null) => {
      if (!option?.value || ids.includes(option.value)) return
      // The picked option carries the title, so register it directly — no fetch.
      setResolved((prev) =>
        prev[option.value]
          ? prev
          : { ...prev, [option.value]: { id: option.value, title: option.label, trashed: false } },
      )
      setValue([...ids, option.value])
    },
    [ids, setValue],
  )

  // --- add-options: bounded server-side search, with a default page on open ---
  const [options, setOptions] = useState<Option[]>([])
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  /**
   * Fetch a bounded page of live (non-trashed) docs for the add box: an
   * alphabetical default when `input` is empty (so the dropdown populates on
   * open) or a title search otherwise. `limit` keeps the payload bounded no
   * matter how large the target grows; already-selected ids are filtered out.
   * @param {string} input - Current search text (empty = default page).
   */
  const fetchOptions = useCallback(
    (input: string) => {
      if (!apiBase) return
      const trimmed = input.trim()
      const query = trimmed ? `where[title][like]=${encodeURIComponent(trimmed)}` : 'sort=title'
      fetch(`${apiBase}?${query}&depth=0&limit=25`, { credentials: 'include' })
        .then((res) => (res.ok ? res.json() : { docs: [] as Doc[] }))
        .then((data: { docs?: Doc[] }) => {
          setOptions(
            (data.docs ?? [])
              .filter((doc) => !ids.includes(String(doc.id)))
              .map((doc) => ({ value: String(doc.id), label: doc.title || 'Untitled' })),
          )
        })
        .catch(() => setOptions([]))
    },
    [ids, apiBase],
  )

  useEffect(() => {
    fetchOptions('')
  }, [fetchOptions])

  const onInputChange = useCallback(
    (input: string) => {
      if (debounce.current) clearTimeout(debounce.current)
      debounce.current = setTimeout(() => fetchOptions(input), 250)
    },
    [fetchOptions],
  )

  // Guard AFTER hooks (Rules of Hooks): only monomorphic hasMany is supported.
  if (!relationTo || field?.hasMany === false) {
    return (
      <div className="field-type">
        <label className="field-label">{label}</label>
        <p style={{ color: 'var(--theme-error-500, #b91c1c)', fontSize: '0.8rem' }}>
          TrashAwareRelationship supports only a monomorphic <code>hasMany</code> relationship — check
          this field’s config.
        </p>
      </div>
    )
  }

  return (
    <div className="field-type">
      <label className="field-label">{label}</label>

      <ul
        style={{
          listStyle: 'none',
          margin: '0 0 0.5rem',
          padding: 0,
          border: '1px solid var(--theme-elevation-150)',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        {ids.length === 0 && (
          <li style={{ padding: '0.5rem 0.75rem', opacity: 0.6 }}>None selected yet.</li>
        )}
        {ids.map((id) => {
          const item = resolved[id]
          const trashed = item?.trashed
          return (
            <li
              key={id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                padding: '0.45rem 0.75rem',
                borderBottom: '1px solid var(--theme-elevation-100)',
                background: trashed ? 'var(--theme-warning-50, #fff7ed)' : undefined,
              }}
            >
              <span style={{ minWidth: 0, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {trashed && (
                  <span
                    title="In the Trash"
                    style={{ display: 'inline-flex', color: 'var(--theme-warning-500, #c75e00)' }}
                  >
                    <WarningIcon />
                  </span>
                )}
                <span>{item ? item.title : '…'}</span>
                {trashed && (
                  <span style={{ opacity: 0.7, fontSize: '0.8rem' }}>(trashed — restore or remove)</span>
                )}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                <a
                  href={`/admin/collections/${relationTo}/${id}`}
                  aria-label="Edit"
                  title="Edit"
                  style={{ display: 'inline-flex', alignItems: 'center' }}
                >
                  <EditIcon />
                </a>
                <button
                  type="button"
                  onClick={() => remove(id)}
                  aria-label="Remove"
                  title="Remove"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: 'var(--theme-error-500, #b91c1c)',
                  }}
                >
                  <XIcon />
                </button>
              </span>
            </li>
          )
        })}
      </ul>

      <ReactSelect
        isMulti={false}
        isClearable
        value={null}
        options={options}
        onChange={(option) => onAdd((option as Option) ?? null)}
        onInputChange={onInputChange}
        filterOption={() => true}
        placeholder="Search to add…"
      />
    </div>
  )
}

export default TrashAwareRelationship
