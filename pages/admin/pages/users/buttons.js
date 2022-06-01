import { Button } from '@chakra-ui/react'

export const AddUserButton = ({ allowed, onOpen }) => {
  return (
    allowed && 
      <Button onClick={() => {
        onOpen()
      }}>
        Add user
      </Button>
  )
}