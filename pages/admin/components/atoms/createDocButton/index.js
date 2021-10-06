import React from 'react'
import { Button } from '@chakra-ui/button'

const CreateDocButton = ({ type }) => {
  return (
    <Button form='create-doc' type='submit'>
      Create {type.slice(0, -1)}
    </Button>
  )
}

export default CreateDocButton
