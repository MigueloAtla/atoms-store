// React/Next
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

// Firebase
import {
  getSchemaByType,
  fetchOneByType,
  updateOneByType
} from '@/firebase/client'

// Components
import UpdateButton from '@/admin/atoms/UpdateButton'
import PageTransitionAnimation from '@/admin/atoms/pageTransitionAnimation'
import LoaderScreen from '@/admin/atoms/loadScreen'
import PreviewDrawer from '@/admin/atoms/previewDrawer'
import EditDataTypeInputWrapper from '@/admin/layouts/editDataTypeInputWrapper'

import { Input, Box, useToast } from '@chakra-ui/react'

// Components
import TipTap from '../components/editor'
import Header from '../components/header'
import TextAreaImage from '@/admin/components/atoms/textAreaImage'

// Styles
import { Label } from '../styles'
import { TextInputStyled, TextAreaStyled } from '@/admin/atoms/textInput/styles'

// Utils
import { capitalizeFirstLetter } from '../utils/utils'

// State
import useStore from '../store/store'

// Hooks
import { useForm, FormProvider } from 'react-hook-form'

const Edit = () => {
  const [schema, setSchema] = useState()
  const [content, setContent] = useState(null)
  const imgURL = useStore(state => state.imgURL)
  const setImgURL = useStore(state => state.setImgURL)
  const editorContent = useRef(null)
  const [onSubmit, setOnSubmit] = useState()
  const { id, type } = useParams()
  const contentCloned = useRef(null)
  const haveEditor = useRef(false)
  const updateRef = useRef(false)
  const setLoading = useStore(state => state.setLoading)
  const selectedCollectionName = useStore(state => state.selectedCollectionName)
  const setSelectedCollectionName = useStore(
    state => state.setSelectedCollectionName
  )
  const [schemaSorted, setSchemaSorted] = useState(null)
  const loading = useStore(state => state.loading)

  const expandedEditor = useStore(state => state.expandedEditor)

  const toast = useToast()

  const {
    register,
    handleSubmit: handleSubmitHook,
    formState: { errors },
    setValue
  } = useForm()

  const updateContent = data => {
    if (contentCloned.current === null) contentCloned.current = content
    Object.keys(contentCloned.current).map(key => {
      if (contentCloned.current[key].type === 'image') {
        contentCloned.current[key].value = imgURL || ''
      } else if (contentCloned.current[key].type === 'richtext') {
      } else contentCloned.current[key].value = data[key]
    })
  }

  useEffect(() => {
    if (selectedCollectionName === '') {
      setSelectedCollectionName(type)
    }
    setLoading(true)
    getSchemaByType(type).then(res => {
      setSchema(res[0])
    })
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
    if (haveEditor.current && contentCloned.current) {
      contentCloned.current['content'].value = editorContent.current
    }
    if (updateRef.current === true) {
      updateOneByType(id, type, contentCloned.current)
      toast({
        title: 'Content updated successfully',
        position: 'bottom-right',
        variant: 'subtle',
        description: 'Alright!',
        duration: 5000,
        isClosable: true
      })
      updateRef.current = false
    }
  }, [onSubmit])

  const handleSubmit = data => {
    updateContent(data)
    updateRef.current = true
    setOnSubmit(!onSubmit)
  }

  const onPreview = data => {
    updateContent(data)
    if (haveEditor.current === true) {
      setOnSubmit(!onSubmit)
    }
    setContent(contentCloned.current)
  }

  console.log(errors)

  const renderDataInput = (obj, key) => {
    let { type, value, isRequired } = obj
    switch (type) {
      case 'longtext':
        return (
          <>
            <TextAreaStyled
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
            <TextInputStyled
              defaultValue={value}
              {...register(key, {
                required: isRequired && 'Write in this field, son of a bitch'
              })}
            />
            {isRequired && errors[key] && errors[key].message}
          </>
        )
      case 'image':
        return (
          <TextAreaImage
            name={key}
            isRequired={isRequired}
            register={register}
            errors={errors}
          />
        )
      case 'richtext': {
        haveEditor.current = true
        return (
          <TipTap
            value={value}
            onSubmit={onSubmit}
            editorContent={editorContent}
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

  useEffect(() => {
    if (content) {
      let contentWithUnusedFields = content

      for (var [key, value] of Object.entries(schema)) {
        if (!content[key]) {
          contentWithUnusedFields[key] = schema[key]
        }
      }

      let schemaSortedArr = Object.entries(contentWithUnusedFields).sort(
        (a, b) => a[1].order - b[1].order
      )
      setSchemaSorted(schemaSortedArr)
    }
  }, [content])

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
                <FormProvider {...{ register, errors, setValue }}>
                  <form
                    id='edit-form'
                    onSubmit={handleSubmitHook(handleSubmit)}
                  >
                    {schemaSorted &&
                      schemaSorted.map((el, i) => {
                        let name = el[0]
                        let key = el[1]
                        let expanded =
                          expandedEditor && el[1].type === 'richtext'
                        console.log(el)
                        return (
                          <EditDataTypeInputWrapper key={i} expanded={expanded}>
                            <Label w='100%' key={i}>
                              {capitalizeFirstLetter(name)}
                            </Label>
                            {renderDataInput(key, name)}
                          </EditDataTypeInputWrapper>
                        )
                      })}
                  </form>
                </FormProvider>
              </Box>
            </>
          )}
        </PageTransitionAnimation>
      )}
    </Box>
  )
}

export default Edit
