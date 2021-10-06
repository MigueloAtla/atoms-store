import React, { useState, useEffect } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'

// UI
import { Button, Grid, Box, IconButton, Flex } from '@chakra-ui/react'
import { ChevronLeftIcon, AddIcon } from '@chakra-ui/icons'

// State
import useStore from '@/admin/store/store'

const ContentHeader = () => {
  const selectedCollectionName = useStore(state => state.selectedCollectionName)
  // const id = useStore(state => state.id)
  let history = useHistory()
  const location = useLocation()
  const [path, setPath] = useState([])
  useEffect(() => {
    let arr = location.pathname.split('/')
    setPath(arr)
  }, [location])

  console.log(path)

  return (
    <Grid
      data-testid='content-header'
      bg='white'
      templateColumns='80px 1fr 200px'
      gap={6}
      h='100%'
      alignItems='center'
    >
      <Box>
        {path.length >= 4 && (
          <IconButton
            colorScheme='purple'
            variant='outline'
            aria-label='Go back'
            icon={<ChevronLeftIcon />}
            onClick={() => {
              history.goBack()
            }}
          />
        )}
      </Box>
      <Flex justifyContent='center'>
        <span>Center content</span>
      </Flex>
      <Box>
        <Link to={`/admin/${selectedCollectionName}/create`}>
          <Button
            colorScheme='purple'
            variant='outline'
            rightIcon={<AddIcon w={3} h={3} />}
          >
            New {selectedCollectionName.slice(0, -1)}
          </Button>
        </Link>
      </Box>
    </Grid>
  )
}

export default ContentHeader
