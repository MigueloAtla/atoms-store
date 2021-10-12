import React from 'react'
import { useHistory } from 'react-router-dom'

// UI
import { IconButton, Flex } from '@chakra-ui/react'
import { ChevronLeftIcon } from '@chakra-ui/icons'
import { HStack } from '@chakra-ui/layout'

// Styles
import { HeaderStyled } from './styles'

const Header = ({ back, title, children }) => {
  let history = useHistory()

  return (
    <HeaderStyled data-testid='header'>
      {back ? (
        <Flex pl='20px'>
          <IconButton
            aria-label='Go back'
            icon={<ChevronLeftIcon />}
            onClick={() => {
              history.goBack()
            }}
          />
        </Flex>
      ) : (
        <div></div>
      )}
      <Flex justifyContent='center'>
        <h3>{title}</h3>
      </Flex>
      <HStack pr='20px' spacing='14px'>
        {children}
      </HStack>
    </HeaderStyled>
  )
}

export default Header
