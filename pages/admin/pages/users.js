import React, {useEffect, useMemo, useState} from 'react'

// firebase
import { getAllUsers, addByCollectionType, updateUserCustomClaimsRole } from 'firebase/client'

// components
import Header from '@/admin/components/header'
import PageTransitionAnimation from '@/admin/atoms/pageTransitionAnimation'
import Table from '@/admin/components/table'
import LoadScreen from '@/admin/atoms/loadScreen'
import {
  Box,
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  useDisclosure,
  Select
} from '@chakra-ui/react'

import styled from 'styled-components'

// hooks
import { useForm } from "react-hook-form"
import useRole from '@/admin/hooks/useRole'
import useStore from '@/admin/store/store'
import { useUser } from '@/hooks/useUser'
// import { useTable } from 'react-table'

// import { signInWithEmailAndPassword, loginWithGithub } from 'firebase/client'

const UsersPage = () => {
	const [ users, setUsers ] = useState(null)
	const [ openUser, setOpenUser ] = useState({})
  const { allowed } = useRole(['admin'])
  const loading = useStore(state => state.loading)

  const { user, setUser, role, setRole } = useUser()

  const { register, handleSubmit, formState } = useForm()
  const { errors } = formState
  const { register: register1 , handleSubmit: handleSubmit1, formState: formState1 } = useForm()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure()

	useEffect(() => {
    getAllUsers().then(({data}) => {
      setUsers(data)
      console.log(users)
    })
  }, [])

  useEffect(() => {
    console.log(openUser)
  }, [openUser])

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

  const onSubmit = ({email, password, displayName, photoURL, role}) => {
    addByCollectionType('users', {email, password, displayName, photoURL, role}).then(() => {
      getAllUsers().then(({data}) => {
        setUsers(data)
      })
    })
    onClose()
  }

  const onSubmitUserRole = (data) => {
    console.log(data)
    updateUserCustomClaimsRole({email: openUser.email, role: data.role}, setRole)
    setOpenUser({})
    onClose1()
  }

  return (
    <>
      <Header title='Users'>
        {allowed && <Button onClick={() => {
          onOpen()
        }}>Add user</Button>}
      </Header>
      
      <Box mt='80px'>
      {loading ? (
        <LoadScreen />
      ) : (
        <PageTransitionAnimation>
          {users?.length > 0 && <Table data={data} columns={columns} clickRowData='row' onClick={(values) => {
            console.log(values)
            setOpenUser(values)
            onOpen1()
          }} />}
        </PageTransitionAnimation> 
      )}
      </Box>

      {/* Modal for sign in */}

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContentStyled minW='50vw'>
          <ModalHeader>User</ModalHeader>
          <ModalCloseButton />
          <ModalBody my='50' mx='10'>
            <Flex flexDirection='column' justify='space-between'>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex flexDirection='column'>
                <label>Email</label>
                <Input
                  type='email'
                  variant='filled'
                  placeholder='email'
                  {...register("email", {required: true && 'Email required'})}
                  />
                  {errors.email?.message}
              </Flex>

              <Flex flexDirection='column'>
              <label>Display name (optional)</label>
                <Input
                  type='text'
                  variant='filled'
                  placeholder='display name'
                  {...register("displayName")}
                />
              </Flex>
              
              <Flex flexDirection='column'>
              <label>User photo url (optional)</label>
                <Input
                  type='text'
                  variant='filled'
                  placeholder='photo url'
                  {...register("photoURL")}
                />
              </Flex>
              
              <Flex flexDirection='column'>
              <label>Password</label>
                <Input
                  type='password'
                  variant='filled'
                  placeholder='password'
                  {...register("password", {required: true && 'Password required'})}
                  />
                  {errors.password?.message}
              </Flex>
              <Select {...register("role")}>
                <option value="">Select...</option>
                <option value="admin">admin</option>
                <option value="editor">editor</option>
                <option value="user">user</option>
              </Select>
              <Button type="submit">Save</Button>
            </form>
            
              {/* <Button
                onClick={() => {
                  // signInWithEmailAndPassword(email, password)
                  addByCollectionType('users', {email, password}).then(() => {
                    getAllUsers().then(({data}) => {
                      setUsers(data)
                    })
                  })
                  onClose()
                }}
              >
                Add User
              </Button> */}
            </Flex>
          </ModalBody>
        </ModalContentStyled>
      </Modal>
      
      <Modal onClose={() => {
        setOpenUser({})
        onClose1()
        }} isOpen={isOpen1} isCentered>
      <ModalOverlay />
        <ModalContentStyled minW='50vw'>
          <ModalHeader>User</ModalHeader>
          <ModalCloseButton />
          <ModalBody my='50' mx='10'>
            <Flex flexDirection='column' justify='space-between'>
            <p>{openUser.uid}</p>
            <form onSubmit={handleSubmit1(onSubmitUserRole)}>
              <Select {...register1("role")}>
                <option value="">Select...</option>
                <option value="admin">admin</option>
                <option value="editor">editor</option>
                <option value="user">user</option>
              </Select>
              <Button type="submit">Save</Button>
            </form>
            </Flex>
          </ModalBody>
        </ModalContentStyled>
      </Modal>
    </>
  )
}

export default UsersPage

const ModalContentStyled = styled(ModalContent)`
  background-color: #ffffffd1;
  backdrop-filter: blur(10px);
  overflow: hidden;
`