import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@chakra-ui/button'
import { capitalizeFirstLetter } from '@/admin/utils/utils'

const NewButton = ({ name }) => {
  const collectionName = capitalizeFirstLetter(name)

  return (
    <Link to={`/admin/${name}/create`}>
      <Button>New {collectionName.slice(0, -1)}</Button>
    </Link>
  )
}

export default NewButton
