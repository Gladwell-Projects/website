import type { Access } from 'payload'
import { checkRole } from './checkRole'

export const adminsAndSelf: Access = ({ req: { user } }) => {
  if (checkRole(['admin'], user)) {
    return true
  }

  if (user) {
    return {
      // fields cannot have access control for query constraints.
      id: {
        equals: user.id,
      },
    }
  }
  return false
}
