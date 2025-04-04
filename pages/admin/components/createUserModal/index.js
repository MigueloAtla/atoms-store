// components
import {
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  Select
} from '@chakra-ui/react'

import styled from 'styled-components'

export const CreateUserModal = ({
  onClose,
  onSubmit,
  isOpen,
  errors,
  register
}) => {
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContentStyled bg='backdrop_bg' minW='50vw'>
        <ModalHeader>User</ModalHeader>
        <ModalCloseButton />
        <ModalBody my='50' mx='10'>
          <Flex flexDirection='column' justify='space-between'>

          <form onSubmit={onSubmit}>
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
  )
}

const ModalContentStyled = styled(ModalContent)`
  /* background-color: #ffffffd1; */
  backdrop-filter: blur(10px);
  overflow: hidden;
`