import { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'

// Firebase
import {
  updateDocByTypeWithRelatedDocs,
  deleteRelatedDoc
} from '@/firebase/client'

export const useEditForm = ({ id, type, content, setContent, imgURL }) => {
  const [onSubmit, setOnSubmit] = useState()
  const [selectedRowIds, setSelectedRowIds] = useState([])
  const [removeList, setRemoveList] = useState([])
  
  const editorContent = useRef(null)
  const contentCloned = useRef(null)
  const haveEditor = useRef(false)
  const updateRef = useRef(false)

  const formUtils = useForm()
  const { handleSubmit: handleSubmitHook } = formUtils

  useEffect(() => {
    if (haveEditor.current && contentCloned.current) {
      contentCloned.current['content'].value = editorContent.current
    }
    if (updateRef.current === true) {
      // update the Doc
      updateDocByTypeWithRelatedDocs(id, type, contentCloned.current, selectedRowIds)
      updateRef.current = false
    }
  }, [onSubmit])

  const updateContent = data => {
    if (contentCloned.current === null) contentCloned.current = content
    Object.keys(contentCloned.current).map(key => {
      if (contentCloned.current[key].type === 'image') {
        contentCloned.current[key].value = imgURL || ''
      } else if (contentCloned.current[key].type === 'richtext') {
      } else contentCloned.current[key].value = data[key]
    })
  }

  const handleSubmit = data => {
    updateContent(data)
    if(removeList.length > 0) {
      removeList.map(({ id, junction }) => {
        deleteRelatedDoc(
            junction,
            id
          )
      })
    }
    updateRef.current = true
    setOnSubmit(!onSubmit)
  }

  const transformDataForTypeInput = el => {
    let name = el[0]
    let obj = el[1]
    return { obj, name }
  }

  const onPreview = data => {
    updateContent(data)
    if (haveEditor.current === true) setOnSubmit(!onSubmit)
    setContent(contentCloned.current)
  }

  const previewSubmit = () => {
    handleSubmitHook(onPreview)
  }

  return {
    removeList,
    setRemoveList,
    haveEditor,
    editorContent,
    contentCloned,
    updateRef,
    onSubmit,
    setOnSubmit,
    selectedRowIds,
    setSelectedRowIds,
    handleSubmit,
    handleSubmitHook,
    transformDataForTypeInput,
    updateContent,
    formUtils,
    previewSubmit
  }
  
}