import styled from 'styled-components'
import { Flex } from '@chakra-ui/react'

export const HeaderStyled = styled(Flex)`
  user-select: none;
  /* background-color: #ffffffed; */
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 6px;
  height: 60px;
  width: calc(100% - 100px);
  width: ${({ width }) => `calc(100% - ${width}px)`};
  align-items: center;
  position: fixed;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(20px);
  display: ${({ expanded }) => (expanded ? 'none' : 'grid')};
`
