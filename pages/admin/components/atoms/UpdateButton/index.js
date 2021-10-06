import React from 'react'
import { Button } from '@chakra-ui/button'

const UpdateButton = ({ type }) => {
  return (
    <Button form='edit-form' type='submit'>
      Update {type.slice(0, -1)}
    </Button>
  )
}

export default UpdateButton
