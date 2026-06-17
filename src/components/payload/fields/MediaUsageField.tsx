'use client'

import { useDocumentInfo } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

type MediaReference = {
  collection: string
  collectionLabel: string
  id: string | number
  title: string
  fields: string[]
}

/**
 * Sidebar panel on the Media edit view that warns the editor which documents
 * reference this image. Deleting the media auto-clears these references (see
 * `clearMediaReferences`), so this surfaces what will change beforehand.
 */
const MediaUsageField = () => {
  const { id } = useDocumentInfo()
  const [references, setReferences] = useState<MediaReference[] | null>(null)

  useEffect(() => {
    if (!id) return
    let active = true

    fetch(`/api/media/${id}/usage`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : { references: [] as MediaReference[] }))
      .then((data: { references?: MediaReference[] }) => active && setReferences(data.references ?? []))
      .catch(() => active && setReferences([]))

    return () => {
      active = false
    }
  }, [id])

  if (!id || !references || references.length === 0) return null

  return (
    <div className="field-type" style={{ marginBlockStart: '1rem' }}>
      <strong style={{ color: 'var(--theme-warning-500, #c75e00)' }}>
        ⚠️ Used in {references.length} place{references.length === 1 ? '' : 's'}
      </strong>
      <p style={{ marginBlock: '0.25rem', fontSize: '0.8rem' }}>
        Deleting this image will remove it from:
      </p>
      <ul style={{ marginBlock: '0.25rem', paddingInlineStart: '1.1rem', fontSize: '0.8rem' }}>
        {references.map((ref) => (
          <li key={`${ref.collection}-${ref.id}`}>
            {ref.collectionLabel}:{' '}
            <a href={`/admin/collections/${ref.collection}/${ref.id}`}>{ref.title}</a>{' '}
            <span style={{ opacity: 0.6 }}>({ref.fields.join(', ')})</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MediaUsageField
