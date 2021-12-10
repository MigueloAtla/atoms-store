// React / Next
import React from 'react'
import { Link } from 'react-router-dom'

import PageTransitionAnimation from '@/admin/atoms/pageTransitionAnimation'
// import LoaderScreen from '@/admin/atoms/loadScreen'
import { Flex, Text, Button } from '@chakra-ui/react'
import Header from '../components/header'

import { getCollections } from '@/firebase/client'

// Utils
import { capitalizeFirstLetter } from '../utils/utils'

// State
import useStore from '@/admin/store/store'
import { useEffect } from 'react'

const CollectionsList = () => {
  const collections = useStore(state => state.collections)
  const setCollections = useStore(state => state.setCollections)
  const rerender = useStore(state => state.rerender)

  useEffect(() => {
    if (collections.length > 0) {
      getCollections().then(c => {
        setCollections(c[0])
      })
    }
  }, [rerender])

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
          gridGap='10px'
        >
          {collections &&
            collections.map((collection, i) => {
              return (
                <Link
                  style={{ width: 'calc(100% - 50px)', height: '100%' }}
                  to={`/admin/collection/${collection.name}`}
                  key={i}
                >
                  <Flex
                    bg='white'
                    height='75px'
                    width='100%'
                    align='center'
                    borderRadius='10px'
                  >
                    <Text as='h4' fontSize='22px' ml='30'>
                      {capitalizeFirstLetter(collection.name)}
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
