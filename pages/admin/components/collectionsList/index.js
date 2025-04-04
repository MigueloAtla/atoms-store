// React / Next
import { Link } from 'react-router-dom'

// Firebase
import { getCollection } from '@/firebase/client'

// Styles
import * as S from './styles'
import styled from 'styled-components'

// Components
import { Flex, Text, Divider } from '@chakra-ui/react'

// State
import useStore from '@/admin/store/store'

const CollectionsList = () => {
  const collections = useStore(state => state.collections)
  const setCollectionData = useStore(state => state.setCollectionData)
  const { 
    setSelectedCollectionName, 
    setSelectedMenuName,
    setSelectedSidebarMenu,
    selectedCollectionName,
    selectedMenuName } = useStore(state => state)
  // const selectedCollectionName = useStore(state => state.selectedCollectionName)
  // const setSelectedSidebarMenu = useStore(state => state.setSelectedSidebarMenu)

  return (
    <Flex direction='column' height='100%' width='100%'>
      <CollectionListSectionTitle>
        Pages
      </CollectionListSectionTitle>
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
                  setSelectedMenuName(collection.name)
                }}
              >
                <CollectionsListItem
                  collection={collection.name}
                  setCollectionData={setCollectionData}
                  selectedCollectionName={selectedCollectionName}
                  selectedMenuName={selectedMenuName}
                  key={i}
                />
              </Link>
            )
          }
        })}
      <Divider mt='30px' />
      <CollectionListSectionTitle>
        Collections
      </CollectionListSectionTitle>
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

const CollectionListSectionTitle = styled(Text)`
  user-select: none;
  color: white;
  font-weight: bold;
  margin: 10px 0;
  text-align: center;
`

const CollectionsListItem = ({
  collection,
  setCollectionData,
  selectedCollectionName,
  selectedMenuName
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
      active={collection === selectedMenuName}
      onClick={handleClick}
    >
      {collection}
    </S.CollectionsListItem>
  )
}

export default CollectionsList
