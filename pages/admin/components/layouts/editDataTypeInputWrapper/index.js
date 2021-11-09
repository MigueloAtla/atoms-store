import React from 'react'
import { Box } from '@chakra-ui/layout'
import styled from 'styled-components'

// const EditDataTypeInputWrapper = ({ children, expanded }) => {
//   return (
//     <Box bg='white' borderRadius='10px' p='20px' mt='30px' position='relative'>
//       {children}
//     </Box>
//   )
// }

const EditDataTypeInputWrapperStyled = styled(Box)`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  margin-top: ${({ expanded }) => !expanded && '30px'};
  width: ${({ expanded }) => expanded && '100vw'};
  position: ${({ expanded }) => (expanded ? 'absolute' : 'relative')};
  left: ${({ expanded }) => expanded && 0};
  top: ${({ expanded }) => expanded && 0};
`
export default EditDataTypeInputWrapperStyled
