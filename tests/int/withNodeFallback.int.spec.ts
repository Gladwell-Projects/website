/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest'
import { withNodeFallback } from '@/components/frontend/lexical/withNodeFallback'

// nodesToJSX stand-in: renders a node's children to a marker string.
const nodesToJSX = ({ nodes }: { nodes: { text?: string }[] }) =>
  `text:${(nodes ?? []).map((n) => n.text ?? '').join('')}`

describe('withNodeFallback', () => {
  it('passes a healthy converter through untouched', () => {
    const converters = withNodeFallback({
      paragraph: ({ node }: any) => `<p>${node.value}</p>`,
    })
    expect(converters.paragraph({ node: { value: 'hi' }, nodesToJSX } as any)).toBe('<p>hi</p>')
  })

  it('degrades a throwing node to its inner text (keeps the copy)', () => {
    const converters = withNodeFallback({
      link: (_args: any) => {
        throw new Error('dangling internal link target')
      },
    })
    const out = converters.link({
      node: { children: [{ text: 'click ' }, { text: 'here' }] },
      nodesToJSX,
    } as any)
    expect(out).toBe('text:click here') // text preserved, broken link wrapper dropped
  })

  it('skips a throwing node that has no text children (e.g. media)', () => {
    const converters = withNodeFallback({
      upload: (_args: any) => {
        throw new Error('deleted media')
      },
    })
    expect(converters.upload({ node: {}, nodesToJSX } as any)).toBeNull()
  })

  it('isolates failures per node — siblings are unaffected', () => {
    const converters = withNodeFallback({
      good: ({ node }: any) => `ok:${node.value}`,
      bad: (_args: any) => {
        throw new Error('boom')
      },
    })
    expect(converters.good({ node: { value: 1 }, nodesToJSX } as any)).toBe('ok:1')
    expect(converters.bad({ node: { children: [{ text: 'x' }] }, nodesToJSX } as any)).toBe('text:x')
  })

  it('passes a React-element converter through without recursing into it', () => {
    // Some default converters (e.g. `horizontalrule`) are pre-built React
    // elements, not functions. React elements are plain objects with a
    // circular `_owner` fiber chain — recursing into one overflows the stack.
    const element: any = { $$typeof: Symbol.for('react.element'), type: 'hr', props: {} }
    element._owner = { owner: null }
    element._owner.owner = element._owner // self-referential, like a real fiber

    const converters = withNodeFallback({ horizontalrule: element } as any)
    // Returned untouched (same reference), and no stack overflow occurred.
    expect(converters.horizontalrule).toBe(element)
  })

  it('recurses into nested block converter maps', () => {
    const converters = withNodeFallback({
      blocks: {
        callout: (_args: any) => {
          throw new Error('bad block data')
        },
      },
    } as any)
    expect(
      (converters.blocks as any).callout({ node: { children: [{ text: 'note' }] }, nodesToJSX }),
    ).toBe('text:note')
  })
})
