import React from 'react'
import { deletePost } from '@/firebase/client'
import { DeleteIcon } from '@chakra-ui/icons'

// State
import useStore from '@/admin/store/store'

const DeleteRowButton = ({
  row: {
    original: { id }
  }
}) => {
  const selectedCollectionName = useStore(state => state.selectedCollectionName)
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center'
      }}
      onClick={e => {
        e.stopPropagation()
        deletePost(id, selectedCollectionName)
      }}
    >
      <DeleteIcon />
    </div>
  )
}

export default DeleteRowButton
