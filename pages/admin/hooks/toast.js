import React from 'react'
import { useToast } from '@chakra-ui/react'

export const useDisplayToast = () => {
  const toast = useToast()
  const displayToast = ({ title, description, type = 'success' }) => {
    toast({
      title,
      description,
      type,
      position: 'bottom-right',
      variant: 'subtle',
      duration: 5000,
      isClosable: true
    })
  }
  return displayToast
}
