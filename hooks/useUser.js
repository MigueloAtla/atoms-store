import { onAuthStateChange, isAdmin } from '@/firebase/client'
import { useEffect, useState } from 'react'
import useStore from '@/store/store'

// const userStates = {
//   NOT_LOGGED: null,
//   NOT_KNOWN: null
// }

export const useUser = () => {
  const { user, setUser, role, setRole } = useStore()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    onAuthStateChange({ setUser, setRole, setLoading })
  }, [])
  // useEffect(() => {
  //   console.log(user)
  //   console.log(role)
  // }, [user, role])

  return { user, role, loading, setUser, setRole }
}
