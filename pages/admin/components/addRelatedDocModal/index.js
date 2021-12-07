import React, { useState, useRef } from 'react'
// import Table from '@/admin/components/table'
import Table from '@/admin/components/selectRowTable'
import styled from 'styled-components'

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box
} from '@chakra-ui/react'
import Img from 'react-cool-img'

// Firebase
import {
  addByCollectionTypeWithCustomID,
  getCollection
} from '@/firebase/client'

const AddRelatedDocModal = ({
  collection,
  content = [],
  junctionName,
  type,
  id,
  setSelectedRowIds
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [relatedCollection, setRelatedCollection] = useState([...content])
  const [selectedLength, setSelectedLength] = useState(0)
  const selectedRowOnTable = useRef([])

  const getTypes = junction => {
    console.log('get types')
    console.log(junction)
    const spliceRelations = junction.split('_')
    let type1, type2
    if (spliceRelations[1] === type) {
      type1 = spliceRelations[1]
      type2 = spliceRelations[2]
    } else {
      type1 = spliceRelations[2]
      type2 = spliceRelations[1]
    }
    return { type1, type2 }
  }

  const getRelationCollection = () => {
    console.log('adding a relation')
    // get all products on modal
    const { type1, type2 } = getTypes(junctionName)
    console.log('type1: ', type1)
    console.log('type2: ', type2)
    getCollection(type2).then(r => {
      console.log(r)
      setRelatedCollection(r)
    })
  }

  /* @Name: addrelatedDoc
   * @args: relatedDocId
   */
  const addRelatedDoc = relatedDocId => {
    // compose ids sorted for doc id (idx_idy)
    let ids = ''
    let type2 = ''
    const spliceRelations = junctionName.split('_')
    if (spliceRelations[1] === type) {
      ids = `${id}_${relatedDocId}`
      type2 = spliceRelations[2]
    } else {
      ids = `${relatedDocId}_${id}`
      type2 = spliceRelations[1]
    }

    // prepare content of doc
    let docContent = {
      [`${type}Id`]: id,
      [`${type2}Id`]: relatedDocId
    }

    // create doc and junction collection if no exists yet
    addByCollectionTypeWithCustomID(junctionName, ids, docContent)
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

  // const onClick = id => {
  //   addRelatedDoc(id)
  // }

  const onSelectRow = selectedRows => {
    selectedRowOnTable.current = selectedRows.map(s => {
      return s.original
    })
  }

  const { type2 } = getTypes(junctionName)
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
          <ModalBody
          // my='50' mx='10' bg='#efefef5e' p='40px' borderRadius='5px'
          >
            {relatedCollection.length > 0 && (
              <Table
                columns={columns}
                data={data}
                onSelectRow={onSelectRow}
                type={type2}
                setSelectedLength={setSelectedLength}
              />
            )}
          </ModalBody>
          <AddButton
            variant='outline'
            m='10px'
            // isDisabled={selectedRowOnTable.current.length <= 0}
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
                return []
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

const ModalStyled = styled(Modal)`
  overflow: hidden;
`

const ModalContentStyled = styled(ModalContent)`
  background-color: #ffffffd1;
  backdrop-filter: blur(10px);
  overflow: hidden;
  margin: 0;
`
const AddButton = styled(Button)`
  /* background-color: black; */
  border: 1px solid #3d3d3d;
`
const TableImage = styled(Img)`
  /* border-radius: 50%;
  height: 100%; */
  overflow: hidden;
  object-fit: cover;
  height: 100%;
  width: 100%;
  transform: scale(1.1);
`
