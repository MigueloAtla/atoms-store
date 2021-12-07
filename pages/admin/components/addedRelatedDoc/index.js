import { Flex, Button } from '@chakra-ui/react'
import React from 'react'

const AddedRelatedDoc = ({
  selectedRowIds,
  setSelectedRowIds,
  relatedDocType,
  type
}) => {
  return (
    <div>
      {selectedRowIds.length > 0 &&
        selectedRowIds.map((selected, i) => {
          return Object.keys(selected).map(key => {
            let spliceRelations = key.split('_')
            let type1, type2
            if (spliceRelations[1] === type) {
              type1 = spliceRelations[1]
              type2 = spliceRelations[2]
            } else {
              type1 = spliceRelations[2]
              type2 = spliceRelations[1]
            }
            if (relatedDocType === type2) {
              return selected[key].map((s, i) => {
                return (
                  <Flex
                    key={i}
                    height='50px'
                    mt='20px'
                    justifyContent='space-between'
                  >
                    {Object.keys(s).map((subkey, i) => {
                      return (
                        <div key={i}>
                          <div>{s[subkey]}</div>
                        </div>
                      )
                    })}
                    <Button
                      height='30px'
                      onClick={() => {
                        // onDelete row
                        let arr = selected[key].filter(item => {
                          return item.id !== s.id
                        })
                        let newState = selectedRowIds

                        selectedRowIds.map((selectedRow, i) => {
                          Object.keys(selectedRow).map(selectDelKey => {
                            if (selectDelKey === key) {
                              newState[i][selectDelKey] = arr
                            }
                          })
                        })
                        setSelectedRowIds(Array.from(newState))
                      }}
                    >
                      remove
                    </Button>
                  </Flex>
                )
              })
            }
          })
        })}
    </div>
  )
}

export default AddedRelatedDoc
