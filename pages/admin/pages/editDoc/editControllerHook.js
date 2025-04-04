// React/Next
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// utils
import { docArrayToObject } from '@/admin/utils/utils'

// Firebase
import {
  getDoc,
  getFullSchemaByType,
  getRelatedDocsFromSchema
} from '@/firebase/client'

// store
import useStore from '@/admin/store/store'

export const useControllerHook = () => {

  const [relations, setRelations] = useState([])
  const [content, setContent] = useState(null)
  const [contentFormatted, setContentFormatted] = useState(null)
  const [preview, setPreview] = useState()

  const { 
    imgURL, 
    globalId,
    setImgURL, 
  } = useStore(state => state)

  const { id, type } = useParams()
  
  useEffect(() => {
    getDoc(id, type).then(res => {
      setContentFormatted(res)
      setContent(docArrayToObject(res))
    })
  }, [globalId, id])

  const setUpDoc = () => {
    // get Schema
    getFullSchemaByType(type).then(data => {
      // set preview functionality
      setPreview(data[0].page)

      // get relations data from the schema
      data[0].relations.length > 0 && getRelatedDocsFromSchema(data[0].relations, id, type).then(res => {
        setRelations([...res])
      })
    })
  }

  useEffect(() => {
    if (content) {
      Object.keys(content).map(key => {
        if (content[key].type === 'image' && content[key].value !== '') {
          setImgURL(content[key].value)
        }
      })
      setUpDoc()
    }
  }, [content])

  return {
    type,
    id,
    relations,
    content,
    contentFormatted,
    imgURL,
    // loading,
    preview,
    setRelations,
    setContent,
    setContentFormatted,
    setImgURL,
    // setLoading,
  }
}