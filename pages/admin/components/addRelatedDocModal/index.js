import React, { useState, useEffect, useRef } from 'react'
import Table from '@/admin/components/selectRowTable'

import {
  Button,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'

import { ModalStyled, ModalContentStyled, AddButton } from './styles'

// Firebase
import { getCollection } from '@/firebase/client'

// Hooks
import usePrepareTable from '@/admin/hooks/prepareDocsTable'

const AddRelatedDocModal = ({
  collection,
  content = [],
  junctionName,
  type,
  setSelectedRowIds
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [relatedCollection, setRelatedCollection] = useState([...content])
  const [selectedLength, setSelectedLength] = useState(0)
  const selectedRowOnTable = useRef([])
  const { data, columns } = usePrepareTable({ collection: relatedCollection })

  const getRelationCollection = () => {
    getCollection(collection).then(r => {
      setRelatedCollection(r)
    })
  }

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
          getRelationCollection()
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
                type={type}
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
