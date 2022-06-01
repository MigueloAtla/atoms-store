// React / Next
import { useEffect, useState, useRef } from 'react'
import { useHistory } from 'react-router-dom'

// Firebase
import {
  addByCollectionType,
  addByCollectionTypeWithRelatedDocs,
} from '@/firebase/client'

// hooks
import { useForm } from 'react-hook-form'
import { useDisplayToast } from '@/admin/hooks/toast'

export const useFormHook = ({
  type,
  imgURL,
  schema
}) => {
  const [onSubmit, setOnSubmit] = useState()
  const [selectedRowIds, setSelectedRowIds] = useState([])
  
  const editorContent = useRef(null)
  const newContent = useRef(null)
  const haveEditor = useRef(false)

  const history = useHistory()

  const formUtils = useForm()
  // const displayToast = useDisplayToast()

  useEffect(() => {
    if (newContent.current) {
      newContent.current['content'].value = editorContent.current
      console.log('editor content create')
      addByCollectionType(type, newContent.current)
      // displayToast({
      //   title: 'Content Created Successfully',
      //   description: 'Alright!'
      // })
      history.goBack()
    }
  }, [editorContent.current])

  const transformDataForTypeInput = el => {
    let name = el[0]
    let type = el[1].type
    let isRequired = el[1].isRequired
    let obj = { type, value: null, isRequired }
    return { obj, name }
  }

  const handleSubmit = data => {
    // Prepare data before write in DB
    newContent.current = {}

    // Object.keys(schema).map(s => {
    //   if (schema[s].type === 'image') {
    //     newContent.current[s] = {
    //       type: schema[s].type,
    //       value: imgURL || '',
    //       isRequired: schema[s].isRequired,
    //       order: schema[s].order
    //     }
    //   } else {
    //     newContent.current[s] = {
    //       type: schema[s].type,
    //       value: data[s] || '',
    //       isRequired: schema[s].isRequired,
    //       order: schema[s].order
    //     }
    //   }
    // })
    schema.map((field) => {
      let { type, order, isRequired } = field[1]
      let field_name = field[0]

      if (type === 'image') {
        newContent.current[field_name] = {
          type,
          value: imgURL || '',
          isRequired,
          order
        }
      } else {
        newContent.current[field_name] = {
          type,
          value: data[field_name] || '',
          isRequired,
          order
        }
      }
    })

    if (haveEditor.current === true) setOnSubmit(!onSubmit)
    else {
      console.log('create handleSubmit')
      console.log('content', newContent.current)
      console.log('schema', schema)
      addByCollectionTypeWithRelatedDocs(type, newContent.current, selectedRowIds)
      // displayToast({
      //   title: 'Content Created Successfully',
      //   description: 'Alright!'
      // })
      history.goBack()
    }
  }

  return {
    selectedRowIds,
    setSelectedRowIds,
    formUtils,
    handleSubmit,
    transformDataForTypeInput,
    onSubmit,
    setOnSubmit,
    editorContent,
    haveEditor,
  }
  
}