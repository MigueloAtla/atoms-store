import useStore from '@/store/store'
import {useEffect, useState} from 'react'

const useRole = (allowedRoles) => {
  const [allowed, setAllowed] = useState(false)
  const role = useStore(state => state.role)
  useEffect(() => {
    console.log(role)
    if(allowedRoles.includes(role)) setAllowed(true)
  }, [role])

  const isAllowed = (allowedRoles) => {
    if(allowedRoles.includes(role)) return true
    return false
  }
  
  return {allowed, isAllowed}
}

export default useRole