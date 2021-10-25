import { Box } from '@chakra-ui/layout'
import styled from 'styled-components'
import { DRAG_IMAGE_STATES } from './dragImageState'

export const TextAreaImageStyled = styled.textarea`
  width: 100%;
  height: 380px;
  border: ${props =>
    props.drag === DRAG_IMAGE_STATES.DRAG_OVER
      ? '2px dashed rgba(66, 153, 225, 0.6)'
      : '2px solid #efefef'};
  background-color: ${props =>
    props.drag === DRAG_IMAGE_STATES.DRAG_OVER ? '#f7f7f7' : 'white'};
  border-radius: 5px;
  resize: none;
  cursor: default;
  transition: border 0.2s linear, background-color 0.2s linear;
  :hover {
    border: 2px solid black;
  }
`

export const TextAreaImageWrapper = styled(Box)``
