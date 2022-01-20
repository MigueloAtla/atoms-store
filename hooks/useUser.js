import { onAuthStateChange, isAdmin } from '@/firebase/client'
import { useEffect, useState } from 'react'
import useStore from '@/store/store'

const userStates = {
  NOT_LOGGED: null,
  NOT_KNOWN: null
}

export const useUser = () => {
  const { user, setUser, admin, setAdmin } = useStore()
  // const [admin, setAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    onAuthStateChange({ setUser, setAdmin, setLoading })
  }, [])
  useEffect(() => {
    console.log(user)
    console.log(admin)
  }, [user, admin])

  return { user, admin, loading, setUser }
}
