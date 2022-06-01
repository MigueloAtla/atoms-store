// React / Next
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// Firebase
import {
  getSchemaByType,
  getRelationsSchema
} from '@/firebase/client'

// utils
// import { docArrayToObject } from '@/admin/utils/utils'

// store
import useStore from '@/admin/store/store'

export const useControllerHook = () => {
  const [schema, setSchema] = useState()
  const [relations, setRelations] = useState([])

  const imgURL = useStore(state => state.imgURL)

  const { type } = useParams()
  
  useEffect(() => {
    type &&
      getSchemaByType(type).then(res => {
        setSchema(res[0])
      })
  }, [])

  useEffect(() => {
    if (schema) {

      getRelationsSchema(type).then(res => {
        setRelations(res || [])
      })
      // console.log(schema)
    }
  }, [schema])

  return {
    type,
    schema,
    relations,
    imgURL,
    setSchema,
    setRelations,
  }
  
}