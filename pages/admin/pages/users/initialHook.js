// react
import { useEffect, useMemo, useState } from "react"

// firebase
import { getAllUsers } from 'firebase/client'

// components
import {
  useDisclosure,
} from '@chakra-ui/react'

// hooks
import { useUser } from '@/hooks/useUser'
import useRole from '@/admin/hooks/useRole'

export const useInitialHook = () => {

  const [ users, setUsers ] = useState(null)
	const [ openUser, setOpenUser ] = useState({})
  
  const { user, setUser, role, setRole } = useUser()
  const { allowed } = useRole(['admin'])

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure()

	useEffect(() => {
    getAllUsers().then(({data}) => {
      setUsers(data)
    })
  }, [])

  const columns = useMemo(
    () => [
      {
        Header: 'email',
        accessor: 'email'
      },
      {
        Header: 'uid',
        accessor: 'uid'
      },
      {
        id: 'role',
        Header: 'role',
        accessor: d => d.customClaims?.role || 'false'
      }
    ],
    []
  )

  const data = useMemo(() => users, [users])
  
  return {
    users,
    setUsers,
    openUser,
    setOpenUser,
    columns,
    data,
    user,
    setUser,
    role,
    setRole,
    open,
    isOpen,
    onOpen,
    onClose,
    isOpen1,
    onOpen1,
    onClose1,
    allowed
  }
}