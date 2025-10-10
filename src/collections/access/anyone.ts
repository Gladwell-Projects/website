import type { Access, FieldAccess } from 'payload'

type EitherAccess = Access | FieldAccess

export const anyone: EitherAccess = () => true
