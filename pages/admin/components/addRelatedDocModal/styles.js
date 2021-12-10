import styled from 'styled-components'
import { Button, Modal, ModalContent } from '@chakra-ui/react'
import Img from 'react-cool-img'

export const ModalStyled = styled(Modal)`
  overflow: hidden;
`

export const ModalContentStyled = styled(ModalContent)`
  background-color: #ffffffd1;
  backdrop-filter: blur(10px);
  overflow: hidden;
  margin: 0;
`

export const AddButton = styled(Button)`
  border: 1px solid #3d3d3d;
`

export const TableImage = styled(Img)`
  overflow: hidden;
  object-fit: cover;
  height: 100%;
  width: 100%;
  transform: scale(1.1);
`
