/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Make a lexical JSX converter map resilient to bad CMS data.
 *
 * Rich-text content can reference things that no longer exist — a deleted
 * upload/media, a dangling internal link target, a block with malformed data.
 * Payload's stock converters don't guard against that, so a single bad node can
 * throw mid-render and abort the *entire* rich-text tree — which during static
 * prerender fails the whole `next build`.
 *
 * This wraps each converter so a throwing node can never take down its
 * siblings: on error the node degrades to its own inner text/children (so the
 * surrounding copy still renders), and nodes with no text children (e.g. an
 * embedded image) are simply skipped. The goal is: the text always renders;
 * only the broken link/media drops out.
 *
 * Nested converter maps (`blocks`, `inlineBlocks`) are wrapped recursively.
 */
const wrap = (type: string, converter: any): any => {
  if (converter && typeof converter === 'object') {
    return Object.fromEntries(
      Object.entries(converter).map(([key, value]) => [key, wrap(`${type}.${key}`, value)]),
    )
  }
  if (typeof converter !== 'function') return converter

  return (args: any) => {
    try {
      return converter(args)
    } catch (err) {
      console.error(`[richtext] converter "${type}" threw; rendering text only`, err)
      try {
        return args?.node?.children ? args.nodesToJSX({ nodes: args.node.children }) : null
      } catch {
        return null
      }
    }
  }
}

export const withNodeFallback = <T extends Record<string, any>>(converters: T): T =>
  Object.fromEntries(
    Object.entries(converters).map(([type, converter]) => [type, wrap(type, converter)]),
  ) as T
