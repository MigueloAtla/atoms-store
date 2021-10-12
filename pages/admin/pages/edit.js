// React/Next
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

// Firebase
import { fetchOneByType, updateOneByType } from '@/firebase/client'

// Components
import UpdateButton from '@/admin/atoms/UpdateButton'
import PageTransitionAnimation from '@/admin/atoms/pageTransitionAnimation'
import LoaderScreen from '@/admin/atoms/loadScreen'
import PreviewDrawer from '@/admin/atoms/previewDrawer'
import Preview from '@/admin/components/preview'
import EditDataTypeInputWrapper from '@/admin/layouts/editDataTypeInputWrapper'

import { Textarea, Input, Box, useToast, Button } from '@chakra-ui/react'

// Components
import TipTap from '../components/editor'
import Header from '../components/header'
import TextAreaImage from '@/admin/components/atoms/textAreaImage'

// Styles
import { Label } from '../styles'

// Utils
import { capitalizeFirstLetter } from '../utils/utils'

// State
import useStore from '../store/store'

// Hooks
import { useForm } from 'react-hook-form'

const Edit = () => {
  const [content, setContent] = useState(null)
  const [canUpdate, setCanUpdate] = useState(false)
  const [update, setUpdate] = useState(false)
  const imgURL = useStore(state => state.imgURL)
  const setImgURL = useStore(state => state.setImgURL)
  const [editorContent, setEditorContent] = useState(null)
  const [onSubmit, setOnSubmit] = useState()
  const { id, type } = useParams()
  const contentCloned = useRef(null)
  const haveEditor = useRef(false)
  const setLoading = useStore(state => state.setLoading)
  const selectedCollectionName = useStore(state => state.selectedCollectionName)
  const setSelectedCollectionName = useStore(
    state => state.setSelectedCollectionName
  )
  const loading = useStore(state => state.loading)

  const toast = useToast()

  const {
    register,
    handleSubmit: handleSubmitHook,
    formState: { errors }
  } = useForm()

  useEffect(() => {
    if (selectedCollectionName === '') {
      setSelectedCollectionName(type)
    }
    setLoading(true)
    fetchOneByType(id, type).then(res => {
      setContent(res)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (content) {
      Object.keys(content).map(key => {
        if (content[key].type === 'image' && content[key].value !== '') {
          setImgURL(content[key].value)
        }
      })
    }
  }, [content])

  useEffect(() => {
    if (contentCloned.current) {
      contentCloned.current['content'].value = editorContent
    }
  }, [editorContent])

  useEffect(() => {
    if (canUpdate === true && update === true) {
      updateOneByType(id, type, contentCloned.current)
      toast({
        title: 'Content updated successfully',
        position: 'bottom-right',
        variant: 'subtle',
        description: 'Alright!',
        // status: 'success',
        duration: 5000,
        isClosable: true
      })
      setCanUpdate(false)
    } else {
      setContent(s => contentCloned.current)
    }
  }, [update])

  const handleSubmit = data => {
    if (update) setUpdate(false)
    if (contentCloned.current === null) contentCloned.current = content
    Object.keys(contentCloned.current).map(key => {
      if (contentCloned.current[key].type === 'image') {
        contentCloned.current[key].value = imgURL || ''
      } else if (contentCloned.current[key].type === 'richtext') {
      } else contentCloned.current[key].value = data[key]
    })

    setCanUpdate(true)

    if (haveEditor.current === true) setOnSubmit(!onSubmit)
    else {
      setUpdate(true)
    }
  }

  const renderDataInput = (obj, key) => {
    let { type, value, isRequired } = obj
    switch (type) {
      case 'longtext':
        return (
          <>
            <Textarea
              rows='6'
              name={key}
              defaultValue={value}
              {...register(key, {
                required: isRequired && 'Write in this field, son of a bitch'
              })}
            />
            {isRequired && errors[key] && errors[key].message}
          </>
        )
      case 'text':
        return (
          <>
            <Input
              name={key}
              defaultValue={value}
              {...register(key, {
                required: isRequired && 'Write in this field, son of a bitch'
              })}
            />
            {isRequired && errors[key] && errors[key].message}
          </>
        )
      case 'image':
        return <TextAreaImage name={key} isRequired={isRequired} />
      case 'richtext': {
        haveEditor.current = true
        return (
          <TipTap
            value={value}
            onSubmit={onSubmit}
            setEditorContent={setEditorContent}
            setUpdate={setUpdate}
          />
        )
      }
      default:
        return (
          <>
            <Input
              name={key}
              defaultValue={value}
              {...register(key, {
                required: isRequired && 'Write in this field, son of a bitch'
              })}
            />
            {isRequired && errors[key] && errors[key].message}
          </>
        )
    }
  }

  const title = content
    ? content.title
      ? content.title.value
      : content.name
      ? content.name.value
      : 'Unknown document'
    : ''

  const onPreview = data => {
    if (contentCloned.current === null) contentCloned.current = content
    Object.keys(contentCloned.current).map(key => {
      if (contentCloned.current[key].type === 'image') {
        contentCloned.current[key].value = imgURL || ''
      } else if (contentCloned.current[key].type === 'richtext') {
      } else contentCloned.current[key].value = data[key]
    })

    if (haveEditor.current === true) {
      setOnSubmit(!onSubmit)
      setOnSubmit(!onSubmit)
    }
  }

  return (
    <Box minH='calc(100% - 50px)'>
      <Header back={true} title={`Editing ${type.slice(0, -1)}: ${title}`}>
        <PreviewDrawer
          onClick={handleSubmitHook(onPreview)}
          content={content}
        />
        <UpdateButton type={type} />
      </Header>

      {loading ? (
        <LoaderScreen />
      ) : (
        <PageTransitionAnimation>
          {content && (
            <>
              <Box m='80px'>
                <form id='edit-form' onSubmit={handleSubmitHook(handleSubmit)}>
                  {Object.keys(content).map((key, i) => {
                    return (
                      <EditDataTypeInputWrapper key={i}>
                        <Label w='100%' key={i}>
                          {capitalizeFirstLetter(key)}
                        </Label>
                        {renderDataInput(content[key], key)}
                      </EditDataTypeInputWrapper>
                    )
                  })}
                </form>
              </Box>
            </>
          )}
        </PageTransitionAnimation>
      )}
    </Box>
  )
}

export default Edit
