import type { Access } from 'payload'

import { checkRole } from './checkRole'

export const adminsAndEditors: Access = ({ req: { user } }) => checkRole(['admin', 'editor'], user)
