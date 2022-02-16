import React, { useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'

// Firebase
import {
  getSchemaByType,
  fetchOneByType,
  updateOneByType,
  fetchRelatedDocs,
  getFullSchemaByType,
  addByCollectionTypeWithCustomIDBatched,
  deleteRelatedDoc,
  updateSeenFieldByType
} from '@/firebase/client'

// components
import {
  Flex, 
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Header from '@/admin/components/header'
import PageTransitionAnimation from '@/admin/atoms/pageTransitionAnimation'
import Charts from '@/admin/components/charts'
import CollectionTable from '@/admin/components/collectionTable'
import StripePaymentsHistory from '@/pages/customAdminPages/store/components/payments'

import { useState } from 'react'

import Img from 'react-cool-img'
import styled from 'styled-components'

const StoreAdminPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [relations, setRelations] = useState([])
  const [ values, setValues ] = useState({})
  const id = useRef(null)
  let history = useHistory()

  const getRelations = async () => {
    let relatedDocs = []

    const types = junction => {
      const spliceRelations = junction.name.split('_')
      let type1, type2
      if (spliceRelations[1] === 'checkouts') {
        type1 = spliceRelations[1]
        type2 = spliceRelations[2]
      } else {
        type1 = spliceRelations[2]
        type2 = spliceRelations[1]
      }
      return { type1, type2 }
    }

    getFullSchemaByType('checkouts').then(async data => {
      if (data.length > 0 && data[0].relations?.length > 0) {
        const promises = []
        // const relatedCollections = []
        data[0].relations.forEach((junction, i) => {
          const { type2 } = types(junction)
          // relatedCollections.push(type2)
          if (junction.display === true) {
            const promise = new Promise(async (resolve, reject) => {
              const { type1, type2 } = types(junction)
              relatedDocs = await fetchRelatedDocs(
                id.current,
                junction.name,
                type1,
                type2
              )
              resolve({
                content: [...relatedDocs],
                collection: type2,
                junctionName: junction.name
              })
            })
            promises.push(promise)
          } else {
            const promise = new Promise(async (resolve, reject) => {
              resolve({ junctionName: junction.name, collection: type2 })
            })
            promises.push(promise)
          }
        })
        if (promises.length > 0) {
          await Promise.all(promises).then(resolved => {
            setRelations([...resolved])
          })
        }
      }
    })
  }

  const onRowClick = (row_values) => {
    id.current = row_values.id
    onOpen()
    setValues(row_values)
  } 

  useEffect(() => {
    getRelations()
  }, [values])

  return (
    <>
      {/* <Header title='Dashboard' /> */}
      <Flex justifyContent='center' width='100%'>
        <PageTransitionAnimation style={{ width: '100%', marginTop: '0' }}>

        <Tabs>
          <TabList style={{
            position: 'sticky',
            top: '0px',
            backgroundColor: 'rgba(24, 26, 27, 0.93)'
          }}>
            <Tab _selected={{ color: 'white', bg: '#0e0d17', boxShadow: 'none' }}>Profit charts</Tab>
            <Tab _selected={{ color: 'white', bg: '#0e0d17', boxShadow: 'none' }}>Selling data</Tab>
            <Tab _selected={{ color: 'white', bg: '#635bff', boxShadow: 'none' }}>Money history - Stripe</Tab>
            <Tab _selected={{ color: 'white', bg: '#0e0d17', boxShadow: 'none' }}>Somethinp</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Charts collection='checkouts' />
            </TabPanel>
            <TabPanel>
            <CollectionTable collection='checkouts' deleteCol={false} handleClick={onRowClick} clickRowData='row' />
            <Modal onClose={onClose} isOpen={isOpen} isCentered>
              <ModalOverlay />
              <ModalContentStyled minW='50vw'>
                <ModalHeader>Checkouts</ModalHeader>
                <ModalCloseButton />
                <ModalBodyStyled>
                  {
                    values && (
                      <Flex flexDirection='column'>
                        <p>Checkout id: {values.id}</p>
                        <p>Customer email: {values.email}</p>
                        <p>Total: {values.total}</p>

                        <p>Products</p>
                        {relations.length > 0 &&
                          relations.map((relation, i) => {
                            return relation.content.map(doc => {
                              return (
                                <ProductRow
                                  key={doc.id}
                                  onClick={e => {
                                    history.push(
                                      `/admin/${relation.collection}/${doc.id}`
                                    )
                                  }}
                                  >
                                    {doc.image && <Img width='50px' height='50px' src={doc.image.value} />}
                                    <p>{doc.title.value}</p>
                                    <p>price: {doc.price.value}</p>
                                </ProductRow>
                              )
                            })
                          })
                        }
                      </Flex>
                    )
                  }
                </ModalBodyStyled>
              </ModalContentStyled>
            </Modal>
            </TabPanel>
            <TabPanel>
              <StripePaymentsHistory />
            </TabPanel>
            <TabPanel>
              <p>Someteng!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>

        </PageTransitionAnimation> 
      </Flex>
    </>
  )
}

export default StoreAdminPage

const ProductRow = styled(Flex)`
  cursor: pointer;
  height: 70px;
  margin-top: 10px;
  padding: 10px;
  border-top: 1px solid black;
  &:hover {
    background-color: black;
  }
`

const ModalContentStyled = styled(ModalContent)`
  background-color: #ffffffd1;
  backdrop-filter: blur(10px);
  height: 80%;
  overflow: hidden;
`

const ModalBodyStyled = styled(ModalBody)`
  margin: 50px 10px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #282828;
    border-radius: 3px;
  }
`