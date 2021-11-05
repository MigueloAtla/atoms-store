import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// components
import EditCollectionForm from '@/admin/components/editSchemaForm'

// State
// import useStore from '@/admin/store/store'
import { getFullSchemaByType } from '@/firebase/client'

const CollectionSchema = () => {
  const { type } = useParams()
  const [schema, setSchema] = useState(null)

  useEffect(() => {
    getFullSchemaByType(type).then(data => {
      setSchema(data)
    })
  }, [])

  return <>{schema && <EditCollectionForm schema={schema} type={type} />}</>
}
export default CollectionSchema
