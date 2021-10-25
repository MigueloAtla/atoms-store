import styled from 'styled-components'
import { Input, Textarea } from '@chakra-ui/react'

export const TextInputStyled = styled(Input)`
  border: 2px solid #eee;
  :focus {
    border: 2px solid black;
    box-shadow: none;
  }
`

export const TextAreaStyled = styled(Textarea)`
  border: 2px solid #eee;
  :focus {
    border: 2px solid black;
    box-shadow: none;
  }
`
