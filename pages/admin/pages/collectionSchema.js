import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// components
import EditCollectionForm from '@/admin/components/editSchemaForm'
import Header from '@/admin/components/header'
// State
// import useStore from '@/admin/store/store'
import { getFullSchemaByType } from '@/firebase/client'
import { Button } from '@chakra-ui/react'

import { capitalizeFirstLetter } from '@/admin/utils/utils'

const CollectionSchema = () => {
  const { type } = useParams()
  const [schema, setSchema] = useState(null)

  useEffect(() => {
    getFullSchemaByType(type).then(data => {
      setSchema(data)
    })
  }, [])

  return (
    <>
      {!schema ? (
        <Header
          back
          title={`Collection schema: ${capitalizeFirstLetter(type)}`}
        >
          <Button>Add field</Button>
          <Button>update</Button>
        </Header>
      ) : (
        <EditCollectionForm schema={schema} type={type} />
      )}
    </>
  )
}
export default CollectionSchema
