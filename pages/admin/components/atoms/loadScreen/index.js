import React from 'react'
import { Flex } from '@chakra-ui/layout'
import { Spinner } from '@chakra-ui/spinner'

const LoadScreen = () => {
  return (
    <Flex
      data-testid='loader'
      justify='center'
      align='center'
      height='calc(100vh - 100px)'
    >
      <Spinner size='xl' />
    </Flex>
  )
}

export default LoadScreen
