import NewButton from '@/admin/atoms/newButton'
import { deleteDocs } from '@/firebase/client'
import { Confirmation } from '@/admin/atoms/confirmModal'

export const CreateNewDocButton = ({ selectedCollectionName }) => {
  return (
    selectedCollectionName ? <NewButton name={selectedCollectionName} /> : null
  )
}

export const DeleteSelectedButton = ({ removeList, selectedCollectionName }) => {
  return (
    removeList.length > 0 ? 
    <Confirmation 
      action={() => {
        deleteDocs(removeList, selectedCollectionName)
      }}
      modalTitle='Delete selected documents?'
    >
      Delete Selected
    </Confirmation> : null
  )
}
