import { Button } from '@chakra-ui/react'

export const EditButton = ({ edit, setEdit }) => {
  return !edit ? <Button onClick={() => {
    setEdit(true)
  }}>Edit Profile</Button> : null
}

export const SaveButton = ({ edit, setEdit }) => {
  return (
    edit ? <>
      <Button onClick={() => {setEdit(false)}}>Cancel</Button>
      <Button form='user' type='submit'>Save</Button>
    </>
    : null
  )
}