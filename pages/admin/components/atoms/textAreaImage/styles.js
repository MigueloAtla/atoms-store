import styled from 'styled-components'
import { DRAG_IMAGE_STATES } from './dragImageState'

export const TextAreaImageStyled = styled.textarea`
  width: 100%;
  height: 78%;
  position: absolute;
  left: 0;
  top: 77px;
  border: ${props =>
    props.drag === DRAG_IMAGE_STATES.DRAG_OVER
      ? '3px dashed rgba(66, 153, 225, 0.6)'
      : '3px solid black'};
  background-color: ${props =>
    props.drag === DRAG_IMAGE_STATES.DRAG_OVER ? '#f7f7f7' : 'white'};
  border-radius: 5px;
  resize: none;
  cursor: default;
  transition: border 0.2s linear, background-color 0.2s linear;
`
