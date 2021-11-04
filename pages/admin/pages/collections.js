// React / Next
import React from 'react'
import { Link } from 'react-router-dom'

import PageTransitionAnimation from '@/admin/atoms/pageTransitionAnimation'
import LoaderScreen from '@/admin/atoms/loadScreen'
import { Flex, Box, Text, Button } from '@chakra-ui/react'
import Header from '../components/header'

// Utils
import { capitalizeFirstLetter } from '../utils/utils'

// State
import useStore from '@/admin/store/store'

const CollectionsList = () => {
  const collections = useStore(state => state.collections)
  const setCollectionData = useStore(state => state.setCollectionData)
  const setSelectedCollectionName = useStore(
    state => state.setSelectedCollectionName
  )
  const selectedCollectionName = useStore(state => state.selectedCollectionName)
  return (
    <Flex direction='column' height='100%'>
      <Header title='Collections types'>
        <Button>
          <Link to='/admin/new-collection'>Create new collection</Link>
        </Button>
      </Header>

      <PageTransitionAnimation>
        <Flex
          w='100%'
          h='100%'
          justify='center'
          align='center'
          direction='column'
        >
          {collections &&
            collections.map((collection, i) => {
              return (
                <Link
                  style={{ width: 'calc(100% - 50px)', height: '100%' }}
                  to={`/admin/collection/${collection}`}
                  key={i}
                >
                  <Flex
                    bg='white'
                    height='150px'
                    borderBottom='1px solid black'
                    width='100%'
                    align='center'
                  >
                    <Text as='h3' ml='30'>
                      {capitalizeFirstLetter(collection)}
                    </Text>
                  </Flex>
                </Link>
              )
            })}
        </Flex>
      </PageTransitionAnimation>
    </Flex>
  )
}

export default CollectionsList
