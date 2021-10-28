import React, { useEffect, useState } from 'react'
import Image from 'next/image'

import { useParams } from 'react-router-dom'

import { getCollection } from '@/firebase/client'
import Img from 'react-cool-img'

import styled from 'styled-components'

import * as S from '../styles'

// Components
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
  const collectionData = useStore(state => state.collectionData)
  const selectedCollectionName = useStore(state => state.selectedCollectionName)
  const setSelectedCollectionName = useStore(
    state => state.setSelectedCollectionName
  )
  const loading = useStore(state => state.loading)
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

  // useEffect(() => {
  //   // When reload the page collection is not defined, so it takes from the url
  //   if (collectionData.length <= 0) {
  //     getCollection(type).then(c => {
  //       setCollectionData(c)
  //     })
  //   }
  //   if (selectedCollectionName === '') {
  //     setSelectedCollectionName(type)
  //   }
  // }, [])

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
            <TableImage
              style={{ backgroundColor: '#efefef', width: '90', height: '90' }}
              quality='50'
              src={m[k].value}
              alt='main image'
              width='90px'
              height='90px'
              layout='fixed'
            />
          )
        } else dataObj[k] = m[k].value
      }
    })
    dataArr.push(dataObj)
  })

  // useEffect(() => {
  //   if (collectionData) {
  //     let collectionDataSortedArr = Object.entries(collectionData).sort(
  //       function (a, b) {
  //         // console.log(a)
  //         // console.log(b)
  //         return a[1].order - b[1].order
  //       }
  //     )
  //     console.log(collectionDataSortedArr)
  //     setCollectionDataSorted(collectionDataSortedArr)
  //   }
  // }, [collectionData])

  const data = React.useMemo(() => dataArr, [collectionData, rerender])

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
            <Table columns={columns} data={data} type={type} />
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
  border-radius: 50%;
  height: 100%;
`
