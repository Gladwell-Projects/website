import type { Field, GroupField } from 'payload'

import deepMerge from 'deepmerge'

export const appearanceOptions = {
  default: {
    label: 'Default',
    value: 'default',
  },
  primary: {
    label: 'Primary Button',
    value: 'primary',
  },
  secondary: {
    label: 'Secondary Button',
    value: 'secondary',
  },
}

export type LinkAppearances = 'default' | 'primary' | 'secondary'

type LinkType = (options?: {
  appearances?: false | LinkAppearances[]
  disableLabel?: boolean
  overrides?: Partial<GroupField>
}) => Field

const link: LinkType = ({ appearances, disableLabel = false, overrides = {} } = {}) => {
  const linkResult: Field = {
    name: 'link',
    type: 'group',
    hooks: {
      // Drop sub-values that don't match the selected link type. The
      // admin `condition`s only hide the other fields; their stored values
      // otherwise persist, so switching e.g. reference -> custom would leave
      // a stale reference in the DB (which then leaks its theme into the
      // nav). Nulling `reference` here is safe even though field hooks run
      // before validation: each sub-field's `admin.condition` (e.g.
      // type === 'reference') gates its own `required` validation
      // (skipValidationFromHere when the condition is false), so the
      // now-empty mismatched fields are never validated as required.
      beforeChange: [
        ({ value }) => {
          if (!value || typeof value !== 'object') return value
          return {
            ...value,
            reference: value.type === 'reference' ? value.reference : null,
            url: value.type === 'custom' ? value.url : null,
            upload: value.type === 'upload' ? value.upload : null,
          }
        },
      ],
    },
    admin: {
      hideGutter: true,
      ...(overrides?.admin || {}),
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'radio',
            admin: {
              layout: 'horizontal',
              width: '50%',
            },
            defaultValue: 'reference',
            options: [
              {
                label: 'Internal link',
                value: 'reference',
              },
              {
                label: 'Custom URL',
                value: 'custom',
              },
              {
                label: 'Upload Document',
                value: 'upload',
              },
            ],
          },
          {
            name: 'newTab',
            type: 'checkbox',
            admin: {
              style: {
                alignSelf: 'flex-end',
              },
              width: '25%',
            },
            label: 'Open in new tab',
          },
        ],
      },
    ],
  }

  const linkTypes: Field[] = [
    {
      name: 'reference',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
      },
      label: 'Document to link to',
      maxDepth: 2,
      relationTo: ['pages', 'artists', 'exhibitions', 'press', 'events', 'viewingRooms'],
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
      },
      label: 'Custom URL',
      required: true,
    },
    {
      name: 'upload',
      type: 'upload',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'upload',
        width: '50%',
      },
      label: 'Document Upload',
      relationTo: 'media',
      hasMany: false,
      filterOptions: {
        or: [
          {
            mimeType: {
              contains: 'image',
            },
          },
          {
            mimeType: {
              contains: 'application/pdf',
            },
          },
        ],
      },
      required: true,
    },
  ]

  if (!disableLabel) {
    linkResult.fields.push({
      type: 'row',
      fields: [
        ...linkTypes,
        {
          name: 'label',
          type: 'text',
          admin: {
            width: '25%',
          },
          label: 'Label',
          required: true,
        },
        {
          name: 'customId',
          type: 'text',
          admin: {
            width: '25%',
          },
        },
      ],
    })
  } else {
    linkResult.fields = [
      ...linkResult.fields,
      ...linkTypes,
      {
        name: 'customId',
        type: 'text',
        admin: {
          width: '25%',
        },
      },
    ]
  }

  if (appearances !== false) {
    let appearanceOptionsToUse = [
      appearanceOptions.default,
      appearanceOptions.primary,
      appearanceOptions.secondary,
    ]

    if (appearances) {
      appearanceOptionsToUse = appearances.map((appearance) => appearanceOptions[appearance])
    }

    linkResult.fields.push({
      name: 'appearance',
      type: 'select',
      admin: {
        description: 'Choose how the link should be rendered.',
      },
      defaultValue: 'default',
      options: appearanceOptionsToUse,
    })
  }

  return deepMerge(linkResult, overrides)
}

export default link
