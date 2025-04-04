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
  Select
} from '@chakra-ui/react'

import styled from 'styled-components'

export const UserModal = ({ onClose, isOpen, openUser, onSubmit, register }) => {
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
    <ModalOverlay />
      <ModalContentStyled bg='backdrop_bg' minW='50vw'>
        <ModalHeader>User</ModalHeader>
        <ModalCloseButton />
        <ModalBody my='50' mx='10'>
          <Flex flexDirection='column' justify='space-between'>
          <p>{openUser.uid}</p>
          <form onSubmit={onSubmit}>
            <Select {...register("role")}>
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
  )
}


const ModalContentStyled = styled(ModalContent)`
  /* background-color: #ffffffd1; */
  backdrop-filter: blur(10px);
  overflow: hidden;
`