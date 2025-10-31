'use client'
import type { DefaultNodeTypes } from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import CustomUploadComponent from './Upload'

import { type JSXConvertersFunction, RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

type NodeTypes = DefaultNodeTypes

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  // Override the default upload converter
  upload: ({ node }) => {
    return <CustomUploadComponent node={node} />
  },
})

export const GladwellRichtext: React.FC<{
  data: SerializedEditorState
  className?: string
}> = ({ data, className }) => {
  return (
    <RichText
      converters={jsxConverters}
      className={`richtext-field col-span-full col-start-1 ${className ? className : 'sm:col-span-8 sm:col-start-1 lg:col-span-6 lg:col-start-1'}`}
      data={data}
    />
  )
}
