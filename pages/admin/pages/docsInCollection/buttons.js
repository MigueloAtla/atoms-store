import NewButton from '@/admin/atoms/newButton'

export const Button = ({ selectedCollectionName }) => {
  return (
    selectedCollectionName && <NewButton name={selectedCollectionName} />
  )
}