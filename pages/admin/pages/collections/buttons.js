// components
import { Button } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

export const CreateButton = () => {
  return (
    <Button>
      <Link to='/admin/new-collection'>Create new collection</Link>
    </Button>
  )
}