import type { Access } from 'payload'

import { checkRole } from './checkRole'

export const published: Access = ({ req: { user } }) => {
  if (checkRole(['admin', 'editor'], user)) {
    return true
  }
  return {
    _status: {
      equals: 'published',
    },
  }
}
