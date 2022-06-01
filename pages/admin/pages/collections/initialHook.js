import { useEffect } from 'react'

// firebase
import { getCollections } from '@/firebase/client'

// store
import useStore from '@/admin/store/store'

export const useInitialHook = () => {
  const {
    collections,
    setCollections,
    rerender
  } = useStore(state => state)
  
  useEffect(() => {
    if (collections !== undefined && collections.length > 0) {
      getCollections().then(c => {
        setCollections(c[0])
      })
    }
  }, [rerender])

  return {
    collections
  }
  
}
