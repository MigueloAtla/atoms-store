import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// Firebase
import { getFullSchemaByType } from '@/firebase/client'

// Components
import Header from '@/admin/components/header'
import EditCollectionForm from '@/admin/components/editSchemaForm'
import { Button } from '@chakra-ui/react'

// Utils
import { capitalizeFirstLetter } from '@/admin/utils/utils'

const EditCollection = () => {
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
export default EditCollection
