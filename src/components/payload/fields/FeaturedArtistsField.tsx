'use client'

import { ReactSelect, useField } from '@payloadcms/ui'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/**
 * One referenced artist resolved for the list row.
 * @property {string} id - Artist document id.
 * @property {string} title - Display title (falls back to a placeholder).
 * @property {boolean} trashed - Whether the artist is in the Trash.
 */
type Artist = { id: string; title: string; trashed: boolean }

/** A `react-select` option (`{ value, label }`). */
type Option = { value: string; label: string }

/** Shape of an artist row returned by the REST API (only fields we read). */
type ArtistDoc = { id: string | number; title?: string; deletedAt?: string | null }

const ARTISTS_API = '/api/artists'

/**
 * Custom list-style UI for the Exhibitions `featuredArtists` relationship.
 *
 * Why this replaces the native relationship field: Payload populates a
 * relationship with `find({ trash: false })`, so a trashed-but-still-referenced
 * artist is dropped from the populate and renders as "untitled" — with no
 * per-field option to include trashed docs or to relabel a chip. This component
 * owns the field value via `useField`, resolves the selected artists itself with
 * `?trash=true`, and renders them as rows: name on the left (trashed ones flagged
 * with a warning), Edit/Remove on the right, plus an async search to add. It
 * writes the same id array the relationship would, so persistence/versioning are
 * unchanged — only the UI is custom.
 *
 * ⚠️ PAYLOAD-UPGRADE FRAGILITY — recheck on every @payloadcms/* bump:
 *   - depends on the public exports `useField` and `ReactSelect` from
 *     `@payloadcms/ui` (prop shapes / behavior can shift across majors);
 *   - assumes the field value is a flat id array (monomorphic `hasMany`);
 *   - assumes the REST `?trash=true` query param + `where[title][like]` search;
 *   - assumes `find`'s default `trash: false` is why natives show "untitled".
 *   If trashed artists render fine in the native field after an upgrade, this
 *   whole component can likely be deleted.
 *
 * @param {{ path?: string }} props - Payload passes the field `path`.
 * @returns {JSX.Element}
 */
const FeaturedArtistsField: React.FC<{ path?: string }> = ({ path = 'featuredArtists' }) => {
  const { value, setValue } = useField<(string | number)[]>({ path })
  const ids = useMemo(() => (Array.isArray(value) ? value.map(String) : []), [value])
  const idsKey = ids.join(',')

  /**
   * Resolved details for the SELECTED artists only (incl. trashed). Fetched by
   * id — never the whole collection — so it stays cheap as `artists` grows into
   * the hundreds+. Only the initially-loaded ids (and any trashed ones) hit the
   * network; artists added via the search already carry their title (see onAdd).
   */
  const [resolved, setResolved] = useState<Record<string, Artist>>({})
  useEffect(() => {
    const missing = ids.filter((id) => !resolved[id])
    if (missing.length === 0) return
    let active = true
    const query = missing.map((id, i) => `where[id][in][${i}]=${encodeURIComponent(id)}`).join('&')

    fetch(`${ARTISTS_API}?${query}&trash=true&depth=0&limit=200`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : { docs: [] as ArtistDoc[] }))
      .then((data: { docs?: ArtistDoc[] }) => {
        if (!active) return
        setResolved((prev) => {
          const next = { ...prev }
          for (const doc of data.docs ?? []) {
            next[String(doc.id)] = {
              id: String(doc.id),
              title: doc.title || 'Untitled artist',
              trashed: Boolean(doc.deletedAt),
            }
          }
          for (const id of missing) if (!next[id]) next[id] = { id, title: 'Unknown artist', trashed: false }
          return next
        })
      })
      .catch(() => {})

    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed by idsKey to avoid array-identity churn
  }, [idsKey])

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
   * Fetch a bounded page of live (non-trashed) artists for the add box: an
   * alphabetical default when `input` is empty (so the dropdown is populated on
   * open), or a title search otherwise. The `limit` keeps the payload bounded no
   * matter how large `artists` grows; already-selected ids are filtered out.
   * @param {string} input - Current search text (empty = default page).
   */
  const fetchOptions = useCallback(
    (input: string) => {
      const trimmed = input.trim()
      const query = trimmed ? `where[title][like]=${encodeURIComponent(trimmed)}` : 'sort=title'
      fetch(`${ARTISTS_API}?${query}&depth=0&limit=25`, { credentials: 'include' })
        .then((res) => (res.ok ? res.json() : { docs: [] as ArtistDoc[] }))
        .then((data: { docs?: ArtistDoc[] }) => {
          setOptions(
            (data.docs ?? [])
              .filter((doc) => !ids.includes(String(doc.id)))
              .map((doc) => ({ value: String(doc.id), label: doc.title || 'Untitled artist' })),
          )
        })
        .catch(() => setOptions([]))
    },
    [ids],
  )

  // Populate on mount + refresh when the selection changes (added artists drop
  // out of the list, removed ones return).
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

  return (
    <div className="field-type">
      <label className="field-label">Featured Artists</label>

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
          <li style={{ padding: '0.5rem 0.75rem', opacity: 0.6 }}>No featured artists yet.</li>
        )}
        {ids.map((id) => {
          const artist = resolved[id]
          const trashed = artist?.trashed
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
              <span style={{ minWidth: 0 }}>
                {trashed && (
                  <span title="In the Trash" style={{ marginRight: 6 }}>
                    ⚠️
                  </span>
                )}
                {artist ? artist.title : '…'}
                {trashed && (
                  <span style={{ opacity: 0.7, marginLeft: 6, fontSize: '0.8rem' }}>
                    (trashed — restore or remove)
                  </span>
                )}
              </span>
              <span style={{ display: 'flex', gap: '0.6rem', flexShrink: 0 }}>
                <a href={`/admin/collections/artists/${id}`} style={{ fontSize: '0.8rem' }}>
                  Edit
                </a>
                <button
                  type="button"
                  onClick={() => remove(id)}
                  aria-label="Remove featured artist"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: 'var(--theme-error-500, #b91c1c)',
                    fontSize: '1.1rem',
                    lineHeight: 1,
                  }}
                >
                  ×
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
        placeholder="Search to add an artist…"
      />
    </div>
  )
}

export default FeaturedArtistsField
