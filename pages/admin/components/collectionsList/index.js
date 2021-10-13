// React / Next
import React from 'react'
import { Link } from 'react-router-dom'

// Styles
import * as S from './styles'

// Components
import { AddIcon } from '@chakra-ui/icons'
import { Flex } from '@chakra-ui/react'
import { IconLink } from '@/admin/atoms/menuLink/styles'

// Firebase functions
import { getCollection } from '@/firebase/client'

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
      {collections &&
        collections.map((collection, i) => {
          return (
            <Link
              to={`/admin/${collection}`}
              key={i}
              onClick={() => setSelectedCollectionName(collection)}
            >
              <CollectionsListItem
                collection={collection}
                setCollectionData={setCollectionData}
                selectedCollectionName={selectedCollectionName}
                key={i}
              />
            </Link>
          )
        })}
      <IconLink to={`/admin/new-collection`}>
        <AddIcon />
      </IconLink>
      <Link to='/admin/media-library'>Media Library</Link>
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
