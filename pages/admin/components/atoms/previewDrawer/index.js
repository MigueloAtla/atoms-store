import React from 'react'
import {
  Drawer,
  DrawerOverlay,
  DrawerBody,
  DrawerContent,
  DrawerHeader
} from '@chakra-ui/react'
import { ButtonStyled } from '@/admin/atoms/button/styles'

import Preview from '@/admin/components/preview'

import { useDisclosure } from '@chakra-ui/hooks'
import styled from 'styled-components'

const PreviewDrawer = ({ onClick, content }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <ButtonStyled
        onClick={() => {
          onClick()
          onOpen()
        }}
      >
        Preview
      </ButtonStyled>

      <Drawer onClose={onClose} isOpen={isOpen} size={'full'}>
        <DrawerOverlay />
        <DrawerContent>
          <HeaderStyled>Preview</HeaderStyled>
          <DrawerBody p='0'>
            {content && <Preview content={content} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default PreviewDrawer

const HeaderStyled = styled(DrawerHeader)`
  background-color: #11101d;
  height: 60px;
  padding: 0;
  color: white;
  display: flex;
  justify-content: center;
`
