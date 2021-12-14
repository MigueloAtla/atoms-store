import React from 'react'
import { useHistory } from 'react-router-dom'

// UI
import { IconButton, Flex } from '@chakra-ui/react'
import { ChevronLeftIcon } from '@chakra-ui/icons'
import { HStack } from '@chakra-ui/layout'

// State
import useStore from '@/admin/store/store'

// Styles
import { HeaderStyled } from './styles'

const Header = ({ back, title, children, width }) => {
  const expandedEditor = useStore(state => state.expandedEditor)
  const toggleCollectionsPanel = useStore(state => state.toggleCollectionsPanel)
  let history = useHistory()

  return (
    <HeaderStyled
      width={toggleCollectionsPanel ? 201 : 91}
      expanded={expandedEditor}
      data-testid='header'
    >
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
