import { onAuthStateChange, isAdmin } from '@/firebase/client'
import { useEffect, useState } from 'react'

const userStates = {
  NOT_LOGGED: null,
  NOT_KNOWN: null
}

export const useUser = () => {
  const [user, setUser] = useState(userStates.NOT_KNOWN)
  const [admin, setAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    onAuthStateChange({ setUser, setAdmin, setLoading })
  }, [])
  useEffect(() => {}, [user, admin])

  return [user, admin, loading]
}
