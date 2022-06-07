import { useEffect, useState } from 'react'
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'

export const Confirmation = ({ action, modalTitle, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [confirm, setConfirm] = useState(false)
    
  useEffect(() => {
    if (confirm) {
      action()
    }
  }, [confirm])
  return (
    <>
      <Button onClick={() => {
        onOpen()
        }} confirm={confirm}>{children}</Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Button mr={3} onClick={() => {
              onClose()
              setConfirm(true)
            }}>
              Yep
            </Button>
            <Button mr={3} onClick={() => {
              onClose()
              setConfirm(false)
            }}>
              Nope
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}