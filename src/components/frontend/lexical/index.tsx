'use client'
import type { DefaultNodeTypes } from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import CustomUploadComponent from './Upload'

import { type JSXConvertersFunction, RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'
import { withNodeFallback } from './withNodeFallback'

type NodeTypes = DefaultNodeTypes

// Every converter is wrapped so a single broken node (deleted media, dangling
// link target, malformed block) degrades to plain text instead of crashing the
// whole render: the copy always shows, only the broken link/media drops out.
const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) =>
  withNodeFallback({
    ...defaultConverters,
    // Override the default upload converter (guards against deleted media)
    upload: ({ node }) => {
      return <CustomUploadComponent node={node} />
    },
  })

export const GladwellRichtext: React.FC<{
  data: SerializedEditorState
  col?: string
  className?: string
}> = ({ col, data, className }) => {
  return (
    <RichText
      converters={jsxConverters}
      className={`richtext-field col-span-full col-start-1 [&_p:last-child]:mb-0 ${className ? className : `sm:col-span-8 sm:col-start-1 lg:col-span-6 ${col === '7' ? 'lg:col-start-7' : 'lg:col-start-1'}`}`}
      data={data}
    />
  )
}
