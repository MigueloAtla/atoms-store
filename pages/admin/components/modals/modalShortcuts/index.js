import React from 'react'

import styled from 'styled-components'

import Shortcuts from '@/admin/components/shortcuts'

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

const ModalShortcuts = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <ShortcutsButton
        onClick={() => {
          onOpen()
        }}
      >
        ?
      </ShortcutsButton>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContentStyled minW='50vw'>
          <ModalHeader>Shortcut guide</ModalHeader>
          <ModalCloseButton />
          <ModalBodyStyled>
            <Shortcuts />
          </ModalBodyStyled>
        </ModalContentStyled>
      </Modal>
    </>
  )
}

export default ModalShortcuts

const ShortcutsButton = styled(Button)`
  /* position: absolute;
  top: 18px;
  right: 22px; */
  /* width: 20px;
  height: 25px; */
`
const ModalContentStyled = styled(ModalContent)`
  background-color: #ffffffd1;
  backdrop-filter: blur(10px);
  height: 80%;
  overflow: hidden;
`

const ModalBodyStyled = styled(ModalBody)`
  margin: 50px 10px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #282828;
    border-radius: 3px;
  }
`
