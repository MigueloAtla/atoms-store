import React, { useEffect, useState } from 'react'
import {
  deletePost,
  fetchRelatedDocs,
  getFullSchemaByType,
  deleteRelatedDoc
} from '@/firebase/client'
import { DeleteIcon } from '@chakra-ui/icons'

// State
import useStore from '@/admin/store/store'

const SelectForDeleteRelationButton = ({
  row
  // row: {
  //   original: { id }
  // }
}) => {
  console.log(row)
  // const selectedCollectionName = useStore(state => state.selectedCollectionName)
  // const setRerender = useStore(state => state.setRerender)
  const relation = useStore(state => state.relation)

  console.log(relation)
  
  const composedId = ''  
  const removeList = ''
  const setRemoveList = ''
  // const relation = ''
  // const ids = removeList.map(el => el.id)

  return (
    <div>
      {/* {ids.includes(composedId) ? <Button
        onClick={e => {
          e.stopPropagation()
          let filtered_removelist = removeList.filter(el => el.id !== composedId)
          setRemoveList(() => [...filtered_removelist])
        }}
      >
        Undo Delete
      </Button>
      :
      <Button
        onClick={e => {
          e.stopPropagation()
          setRemoveList((prevState) => [...prevState, {id: composedId, junction: relation.junctionName}])
        }}
      >
        Delete
      </Button>
      } */}
    </div>
  )
}

export default SelectForDeleteRelationButton
