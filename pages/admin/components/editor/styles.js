import styled from 'styled-components'
import { Button, Box } from '@chakra-ui/react'

export const Styles = styled.div`
  div div {
    border: 1px solid #e2e8f0;
    border-radius: 5px;
    padding: 20px;
    min-height: 300px;
  }
  img {
    max-width: 500px;
  }
`
export const MenuStyled = styled(Box)`
  position: sticky;
  top: 60px;
  bottom: 100px;
  z-index: 1;
  background-color: #ffffffed;
  backdrop-filter: blur(20px);
  border-radius: 0 0 5px 5px;
`
export const EditorButton = styled(Button)`
  height: 30px;
`
