import type { Access, FieldAccess } from 'payload'

import { checkRole } from './checkRole'

export const admins: Access = ({ req: { user } }) => checkRole(['admin'], user)

export const adminsField: FieldAccess = ({ req: { user } }) =>
  checkRole(['admin'], user)
