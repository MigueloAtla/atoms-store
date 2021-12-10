import React, { useState, useEffect, useRef } from 'react'
import Table from '@/admin/components/selectRowTable'

import {
  Button,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box
} from '@chakra-ui/react'

import {
  ModalStyled,
  ModalContentStyled,
  AddButton,
  TableImage
} from './styles'

// Firebase
import { getCollection } from '@/firebase/client'

// utils
import { getTypes } from '@/admin/utils/utils'

const prepareTable = () => {}

const AddRelatedDocModal = ({
  collection,
  content = [],
  junctionName,
  setSelectedRowIds
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [relatedCollection, setRelatedCollection] = useState([...content])
  const [selectedLength, setSelectedLength] = useState(0)
  const selectedRowOnTable = useRef([])
  const type2Ref = useRef()

  useEffect(() => {
    const { type2 } = getTypes(junctionName)
    type2Ref.current = type2
  }, [junctionName])

  const getRelationCollection = () => {
    getCollection(type2Ref.current).then(r => {
      setRelatedCollection(r)
    })
  }

  // Prepare table: Columns
  const arr = []
  const cols =
    relatedCollection.length > 0
      ? Object.keys(relatedCollection[0]).map(key => {
          return key
        })
      : []
  cols.map(col => {
    arr.push({
      Header: col,
      accessor: col
    })
  })

  const columns = React.useMemo(() => arr, [arr])

  // Prepare table: Data
  const dataArr = []
  relatedCollection &&
    relatedCollection.map(c => {
      let id = { id: c.id }
      let fields = {}
      Object.keys(c).map(key => {
        if (key !== 'id') {
          fields = { ...fields, [key]: c[key].value }
        }
        if (c[key].type === 'image') {
          fields = {
            ...fields,
            [key]: (
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
                  src={c[key].value}
                  alt='main image'
                  width='90px'
                  height='90px'
                  layout='fixed'
                />
              </Box>
            )
          }
        }
      })
      fields = { ...fields, ...id }
      dataArr.push(fields)
    })
  const data = React.useMemo(() => dataArr, [relatedCollection])

  const onSelectRow = selectedRows => {
    selectedRowOnTable.current = selectedRows.map(s => {
      return s.original
    })
  }

  return (
    <>
      <Button
        variant='outline'
        m='5px'
        onClick={() => {
          onOpen()
          getRelationCollection(junctionName)
        }}
      >
        Add {collection}
      </Button>
      <ModalStyled
        blockScrollOnMount
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <ModalOverlay />
        <ModalContentStyled minW='50vw' h='90vh'>
          <ModalHeader>Select a {collection}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {relatedCollection.length > 0 && (
              <Table
                columns={columns}
                data={data}
                onSelectRow={onSelectRow}
                type={type2Ref.current}
                setSelectedLength={setSelectedLength}
              />
            )}
          </ModalBody>
          <AddButton
            variant='outline'
            m='10px'
            onClick={() => {
              setSelectedRowIds(prevState => {
                // arr with elements
                if (prevState.length > 0) {
                  let arr = []
                  let keys = []
                  prevState.map(el => {
                    Object.keys(el).map(key => {
                      keys.push(key)

                      // selected type
                      if (key === junctionName) {
                        const junctionKey = Object.keys(el).map(
                          junctionKey => junctionKey
                        )[0]
                        arr.push({
                          [junctionName]: [
                            ...el[junctionKey],
                            ...selectedRowOnTable.current
                          ]
                        })
                      }

                      // is not selected
                      else {
                        arr.push(el)
                      }
                    })
                  })

                  // if arr is not empty but rows of selected type are not added yet
                  if (!keys.includes(junctionName)) {
                    arr.push({ [junctionName]: selectedRowOnTable.current })
                  }
                  return arr

                  // empty arr
                } else {
                  return [
                    { [junctionName]: selectedRowOnTable.current },
                    ...prevState
                  ]
                }
              })
              onClose()
            }}
          >
            Add {selectedLength} {collection}
          </AddButton>
        </ModalContentStyled>
      </ModalStyled>
    </>
  )
}

export default AddRelatedDocModal
