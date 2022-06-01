// Components
import { Button } from '@chakra-ui/react'

export const AddFieldButton = ({ append }) => {
  return (
    <Button
      type='button'
      onClick={() => {
        append({ name: '', type: '', order: '', isRequired: false })
      }}
    >
      Add field
    </Button>
  )
} 

export const CreateButton = () => {
  return (
    <Button form='create-collection' type='submit'>
      Create collection
    </Button>
  )
}