// react
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// Firebase
import { getFullSchemaByType } from '@/firebase/client'

export const useInitialHook = () => {
  const { type } = useParams()
  const [schema, setSchema] = useState(null)

  useEffect(() => {
    getFullSchemaByType(type).then(data => {
      setSchema(data)
    })
  }, [])

  return {
    schema,
    type
  }
}