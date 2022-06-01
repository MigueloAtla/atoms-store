// react
import { useState } from 'react'

// hooks
import { useUser } from '@/hooks/useUser'
import useRole from '@/admin/hooks/useRole'

export const useInitialHook = () => {
  const [edit, setEdit] = useState(false)
  const { user, setUser, role, setRole } = useUser()
  const { allowed } = useRole(['admin'])

  return {
    user,
    setUser,
    role,
    setRole,
    edit,
    setEdit,
    allowed
  }
}