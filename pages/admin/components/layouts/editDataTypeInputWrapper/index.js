import React from 'react'
import { Box } from '@chakra-ui/layout'

const EditDataTypeInputWrapper = ({ children }) => {
  return (
    <Box bg='white' borderRadius='10px' p='20px' mt='30px' position='relative'>
      {children}
    </Box>
  )
}

export default EditDataTypeInputWrapper
