import React, { useState, useRef } from 'react'
// import Table from '@/admin/components/table'
import Table from '@/admin/components/selectRowTable'

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'

// Firebase
import {
  addByCollectionTypeWithCustomID,
  getCollection
} from '@/firebase/client'

const AddRelatedDocModal = ({
  collection,
  content,
  junctionName,
  type,
  id,
  relatedDocRef,
  selectedRowIds
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [relatedCollection, setRelatedCollection] = useState([...content])
  // const selectedRowOnTable = useRef([])
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
      // console.log(c.id)
      let id = { id: c.id }
      let fields = {}
      Object.keys(c).map(key => {
        if (key !== 'id') {
          fields = { ...fields, [key]: c[key].value }
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
      return s.original.id
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
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent minW='50vw' h='90vh'>
          <ModalHeader>Select a {collection}</ModalHeader>
          <ModalCloseButton />
          <ModalBody my='50' mx='10' bg='#efefef5e' p='40px' borderRadius='5px'>
            {relatedCollection.length > 0 && (
              <Table columns={columns} data={data} onSelectRow={onSelectRow} />
            )}
          </ModalBody>
          <Button
            variant='outline'
            m='5px'
            // isDisabled={selectedRowOnTable.current.length <= 0}
            onClick={() => {
              // const { type2 } = getTypes(junctionName)
              selectedRowIds.current = [
                ...selectedRowIds.current,
                { [junctionName]: selectedRowOnTable.current }
              ]
              onClose()
            }}
          >
            Add {collection}
          </Button>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddRelatedDocModal
