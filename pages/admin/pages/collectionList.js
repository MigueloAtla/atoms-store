import React, { useEffect, useState } from 'react'

import { useParams, useHistory } from 'react-router-dom'

import { getCollection } from '@/firebase/client'
import Img from 'react-cool-img'

import styled from 'styled-components'

import * as S from '../styles'

// Components
import { Box } from '@chakra-ui/layout'
import Header from '@/admin/components/header'
import NewButton from '@/admin/atoms/newButton'
import PageTransitionAnimation from '@/admin/atoms/pageTransitionAnimation'
import LoadScreen from '@/admin/atoms/loadScreen'
import DeleteRowButton from '@/admin/atoms/deleteRowButton'
import Table from '@/admin/components/table'
import { Flex } from '@chakra-ui/react'

// State
import useStore from '@/admin/store/store'

// Utils
import { capitalizeFirstLetter } from '@/admin/utils/utils'

const CollectionList = () => {
  // const [collectionDataSorted, setCollectionDataSorted] = useState(null)
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

  const { type } = useParams()

  useEffect(() => {
    getCollection(type).then(c => {
      setCollectionData(c)
    })
    if (selectedCollectionName === '') {
      setSelectedCollectionName(type)
    }
  }, [rerender])

  // Prepare columns for the table
  let arr = []

  if (collectionData.length > 0) {
    // let fields = Object.keys(collectionData[0])
    const cols_order = Object.entries(collectionData[0]).sort(
      (a, b) => a[1].order - b[1].order
    )
    const fields_ordered = cols_order.map(m => m[0])
    fields_ordered.map(f => {
      arr.push({
        Header: f,
        accessor: f
      })
    })
  }
  arr.push({
    Header: 'Delete',
    accesor: 'id',
    Cell: DeleteRowButton
  })

  const columns = React.useMemo(() => arr, [arr])

  // Prepare data for the table
  let dataArr = []
  collectionData.map(m => {
    let dataObj = {}
    Object.keys(m).map(k => {
      if (k === 'id') dataObj[k] = m[k]
      else {
        if (m[k].type === 'image' && m[k].value) {
          dataObj[k] = (
            <Box
              border='1px solid #333'
              borderRadius='50%'
              w='80px'
              h='80px'
              overflow='hidden'
            >
              <TableImage
                style={{
                  backgroundColor: '#efefef',
                  width: '90',
                  height: '90'
                }}
                quality='50'
                src={m[k].value}
                alt='main image'
                width='90px'
                height='90px'
                layout='fixed'
              />
            </Box>
          )
        } else dataObj[k] = m[k].value
      }
    })
    dataArr.push(dataObj)
  })

  const data = React.useMemo(() => dataArr, [collectionData, rerender])

  const onClick = id => {
    setId(id)
    history.push(`/admin/${type}/${id}`)
  }

  return (
    <S.ContentStyled>
      <Header title={capitalizeFirstLetter(selectedCollectionName) || ''}>
        {selectedCollectionName && <NewButton name={selectedCollectionName} />}
      </Header>

      {loading ? (
        <LoadScreen />
      ) : (
        <PageTransitionAnimation>
          {data.length > 0 ? (
            <Table
              columns={columns}
              data={data}
              type={type}
              onClick={onClick}
            />
          ) : (
            <Flex w='100%' h='100%' justify='center' align='center'>
              You may want to create a {type}
            </Flex>
          )}
        </PageTransitionAnimation>
      )}
    </S.ContentStyled>
  )
}

export default CollectionList

const TableImage = styled(Img)`
  /* border-radius: 50%;
  height: 100%; */
  overflow: hidden;
  object-fit: cover;
  height: 100%;
  width: 100%;
  transform: scale(1.1);
`
