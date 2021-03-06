// React / Next
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

// Firebase
import { getCollection } from '@/firebase/client'

// Styles
import * as S from './styles'

// Components
import { Flex, Text, Divider } from '@chakra-ui/react'

// State
import useStore from '@/admin/store/store'

const CollectionsList = () => {
  const collections = useStore(state => state.collections)
  const setCollectionData = useStore(state => state.setCollectionData)
  const setSelectedCollectionName = useStore(
    state => state.setSelectedCollectionName
  )
  const selectedCollectionName = useStore(state => state.selectedCollectionName)
  const setSelectedSidebarMenu = useStore(state => state.setSelectedSidebarMenu)

  return (
    <Flex direction='column' height='100%' width='100%'>
      <Text color='white' fontWeight='bold' my='10px' textAlign='center'>
        Pages
      </Text>
      {collections !== undefined &&
        collections.length > 0 &&
        collections.map((collection, i) => {
          if (collection.page === true) {
            return (
              <Link
                to={`/admin/${collection.name}`}
                key={i}
                onClick={() => {
                  setSelectedCollectionName(collection.name)
                  setSelectedSidebarMenu('collections')
                }}
              >
                <CollectionsListItem
                  collection={collection.name}
                  setCollectionData={setCollectionData}
                  selectedCollectionName={selectedCollectionName}
                  key={i}
                />
              </Link>
            )
          }
        })}
      <Divider mt='30px' />
      <Text color='white' fontWeight='bold' my='10px' textAlign='center'>
        Collections
      </Text>
      {collections !== undefined &&
        collections.length > 0 &&
        collections.map((collection, i) => {
          if (collection.page === false) {
            return (
              <Link
                to={`/admin/${collection.name}`}
                key={i}
                onClick={() => setSelectedCollectionName(collection.name)}
              >
                <CollectionsListItem
                  collection={collection.name}
                  setCollectionData={setCollectionData}
                  selectedCollectionName={selectedCollectionName}
                  key={i}
                />
              </Link>
            )
          }
        })}
    </Flex>
  )
}

const CollectionsListItem = ({
  collection,
  setCollectionData,
  selectedCollectionName
}) => {
  const setLoading = useStore(state => state.setLoading)
  const handleClick = () => {
    setLoading(true)
    getCollection(collection).then(c => {
      setCollectionData(c)
      setLoading(false)
    })
  }
  return (
    <S.CollectionsListItem
      active={collection === selectedCollectionName}
      onClick={handleClick}
    >
      {collection}
    </S.CollectionsListItem>
  )
}

export default CollectionsList
