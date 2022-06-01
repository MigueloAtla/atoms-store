import { Button } from '@chakra-ui/react'
export const AppendButton = ({ append }) => {
  return (
    <Button
      type='button'
      onClick={() => {
        append({
          name: '',
          type: '',
          order: '',
          isRequired: false
        })
      }}
    >
      Add field
    </Button>)
}

export const UpdateButton = () => {
  return (
    <Button form='edit-collection' type='submit'>
      update
    </Button>
  )
}