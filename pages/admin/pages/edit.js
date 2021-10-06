// React/Next
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

// Firebase
import { fetchOneByType, updateOneByType } from '@/firebase/client'

// Components
import UpdateButton from '@/admin/atoms/UpdateButton'
import PageTransitionAnimation from '@/admin/atoms/pageTransitionAnimation'
import LoaderScreen from '@/admin/atoms/loadScreen'
import EditDataTypeInputWrapper from '@/admin/layouts/editDataTypeInputWrapper'

import { Textarea, Input, Box, useToast } from '@chakra-ui/react'

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
  const imgURL = useStore(state => state.imgURL)
  const setImgURL = useStore(state => state.setImgURL)
  const [editorContent, setEditorContent] = useState()
  const [onSubmit, setOnSubmit] = useState()
  const { id, type } = useParams()
  const contentCloned = useRef(null)
  const haveEditor = useRef(false)

  const setLoading = useStore(state => state.setLoading)
  const loading = useStore(state => state.loading)

  const toast = useToast()

  const {
    register,
    handleSubmit: handleSubmitHook,
    formState: { errors }
  } = useForm()

  useEffect(() => {
    setImgURL('')
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

  // Get data from TipTap editor after submit and update
  // the doc on firebase
  useEffect(() => {
    if (contentCloned.current) {
      contentCloned.current['content'].value = editorContent
      updateOneByType(id, type, contentCloned.current)

      toast({
        title: 'Content Updated Successfully',
        position: 'bottom-right',
        variant: 'subtle',
        description: 'Now go home, bro.',
        // status: 'success',
        duration: 5000,
        isClosable: true
      })
    }
  }, [editorContent])

  const handleSubmit = data => {
    contentCloned.current = content
    Object.keys(contentCloned.current).map(key => {
      if (contentCloned.current[key].type === 'image') {
        contentCloned.current[key].value = imgURL || ''
      } else contentCloned.current[key].value = data[key]
    })

    if (haveEditor.current === true) setOnSubmit(!onSubmit)
    else {
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

  return (
    <Box minH='calc(100% - 50px)'>
      <Header back={true} title={`Editing ${type.slice(0, -1)}: ${title}`}>
        <UpdateButton type={type} />
      </Header>

      {loading ? (
        <LoaderScreen />
      ) : (
        <PageTransitionAnimation>
          {content && (
            <>
              <Box m='20px'>
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
