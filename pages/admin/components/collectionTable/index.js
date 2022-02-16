import React, { useEffect, useRef, useState } from 'react'

import { useParams, useHistory } from 'react-router-dom'

import { getCollection } from '@/firebase/client'

import * as S from '../../styles'

// Components
import Header from '@/admin/components/header'
import NewButton from '@/admin/atoms/newButton'
import PageTransitionAnimation from '@/admin/atoms/pageTransitionAnimation'
import LoadScreen from '@/admin/atoms/loadScreen'
import Table from '@/admin/components/table'
import { Flex } from '@chakra-ui/react'

// State
import useStore from '@/admin/store/store'

// Utils
import { capitalizeFirstLetter } from '@/admin/utils/utils'

// Hooks
import usePrepareTable from '@/admin/hooks/prepareDocsTable'

const CollectionTable = ({ 
  collection, 
  deleteCol = false, 
  handleClick,
  clickRowData, 
  fixedFooter
  }) => {
  let history = useHistory()
  const collectionData = useStore(state => state.collectionData)
  const selectedCollectionName = useStore(state => state.selectedCollectionName)
  const setSelectedCollectionName = useStore(
    state => state.setSelectedCollectionName
  )
  const loading = useStore(state => state.loading)
  const setId = useStore(state => state.setId)
  const setCollectionData = useStore(state => state.setCollectionData)
  const rerender = useStore(state => state.rerender)
  const pageWidth = useRef(null)
  const { data, columns } = usePrepareTable({
    collection: collectionData,
    deleteCol
  })

  useEffect(() => {
    getCollection(collection).then(c => {
      setCollectionData(c)
    })
    if (selectedCollectionName === '') {
      setSelectedCollectionName(collection)
    }
  }, [rerender])

  const onClick = handleClick ? handleClick : id => {
    setId(id)
    history.push(`/admin/${collection}/${id}`)
  }

  return (
    <S.ContentStyled ref={pageWidth}>
      {/* <Header title={capitalizeFirstLetter(selectedCollectionName) || ''}>
        {selectedCollectionName && <NewButton name={selectedCollectionName} />}
      </Header> */}

      {loading ? (
        <LoadScreen />
      ) : (
        <PageTransitionAnimation>
          {data.length > 0 ? (
            <Table
              columns={columns}
              data={data}
              type={collection}
              onClick={onClick}
              clickRowData={clickRowData}
              fixedFooter={fixedFooter}
            />
          ) : (
            <Flex w='100%' h='100%' justify='center' align='center'>
              You may want to create a {collection}
            </Flex>
          )}
        </PageTransitionAnimation>
      )}
    </S.ContentStyled>
  )
}

export default CollectionTable
