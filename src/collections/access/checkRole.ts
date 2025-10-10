import type { User } from '@/payload-types'

export const checkRole = (
  allRoles: User['role'][],
  user: User | null
): boolean => {
  if (user) {
    if (
      allRoles?.some((role) => {
        return user.role === role
      })
    ) {
      return true
    }
  }

  return false
}
