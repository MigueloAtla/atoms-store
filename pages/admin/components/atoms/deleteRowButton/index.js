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

const DeleteRowButton = ({
  row: {
    original: { id }
  }
}) => {
  const selectedCollectionName = useStore(state => state.selectedCollectionName)
  const setRerender = useStore(state => state.setRerender)

  const deleteRelations = async () => {
    let relatedDocs = []

    const types = junction => {
      const spliceRelations = junction.name.split('_')
      let type1, type2
      if (spliceRelations[1] === selectedCollectionName) {
        type1 = spliceRelations[1]
        type2 = spliceRelations[2]
      } else {
        type1 = spliceRelations[2]
        type2 = spliceRelations[1]
      }
      return { type1, type2 }
    }

    getFullSchemaByType(selectedCollectionName).then(async data => {
      if (data.length > 0 && data[0].relations?.length > 0) {
        const promises = []
        data[0].relations.forEach(async (junction, i) => {
          const { type1, type2 } = types(junction)
          relatedDocs = await fetchRelatedDocs(id, junction.name, type1, type2)

          relatedDocs.map(doc => {
            let composedId
            const spliceRelations = junction.name.split('_')
            if (spliceRelations[1] === selectedCollectionName) {
              composedId = `${id}_${doc.id}`
            } else {
              composedId = `${doc.id}_${id}`
            }
            deleteRelatedDoc(junction.name, composedId)
          })
        })
      }
    })
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center'
      }}
      onClick={e => {
        e.stopPropagation()
        deleteRelations()
        deletePost(id, selectedCollectionName)
        setRerender(s => !s)
      }}
    >
      <DeleteIcon />
    </div>
  )
}

export default DeleteRowButton
