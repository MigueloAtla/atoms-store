import React from 'react'
import { Box, Flex } from '@chakra-ui/layout'
import styled from 'styled-components'

const DocFormFieldWrapper = styled(Box)`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  margin-top: ${({ $expanded }) => $expanded === 0 && '30px'};
  width: ${({ $expanded }) => $expanded === 1 && '100vw'};
  position: ${({ $expanded }) => ($expanded === 1 ? 'absolute' : 'relative')};
  left: ${({ $expanded }) => $expanded === 1 && 0};
  top: ${({ $expanded }) => $expanded === 1 && 0};
`
export default DocFormFieldWrapper
