// React / Next
import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'

// Styles
import { Label } from '../styles'

// Ui
import { Textarea, Input, useToast, Box } from '@chakra-ui/react'

// Firebase
import { getSchemaByType, addByCollectionType } from '@/firebase/client'

// Utils
import { capitalizeFirstLetter } from '../utils/utils'

// Components
import TipTap from '../components/editor'
import CreateDocButton from '@/admin/atoms/createDocButton'
import Header from '@/admin/components/header'
import TextAreaImage from '@/admin/components/atoms/textAreaImage'

// Hooks
import { useForm } from 'react-hook-form'
import EditDataTypeInputWrapper from '@/admin/layouts/editDataTypeInputWrapper'
import PageTransitionAnimation from '@/admin/atoms/pageTransitionAnimation'

// Store
import useStore from '@/admin/store/store'

const Create = () => {
  const [schema, setSchema] = useState()
  const imgURL = useStore(state => state.imgURL)
  const setImgURL = useStore(state => state.setImgURL)
  const [editorContent, setEditorContent] = useState()
  const [onSubmit, setOnSubmit] = useState()
  const newContent = useRef(null)
  const haveEditor = useRef(false)
  const toast = useToast()
  const { type } = useParams()

  const {
    register,
    handleSubmit: handleSubmitHook,
    formState: { errors }
  } = useForm()

  useEffect(() => {
    // setImgURL('')
    type &&
      getSchemaByType(type).then(res => {
        setSchema(res[0])
      })
  }, [])

  useEffect(() => {
    if (newContent.current) {
      newContent.current['content'].value = editorContent
      addByCollectionType(type, newContent.current)

      toast({
        title: 'Content Created Successfully',
        position: 'bottom-right',
        variant: 'subtle',
        description: 'Alright!',
        // status: 'success',
        duration: 5000,
        isClosable: true
      })
    }
  }, [editorContent])

  const handleSubmit = data => {
    newContent.current = {}

    Object.keys(schema).map(s => {
      if (schema[s].type === 'image') {
        newContent.current[s] = {
          type: schema[s].type,
          value: imgURL || '',
          isRequired: schema[s].isRequired
        }
      } else {
        newContent.current[s] = {
          type: schema[s].type,
          value: data[s] || '',
          isRequired: schema[s].isRequired
        }
      }
    })

    if (haveEditor.current === true) setOnSubmit(!onSubmit)
    else {
      addByCollectionType(type, newContent.current)
      toast({
        title: 'Content Created Successfully',
        position: 'bottom-right',
        variant: 'subtle',
        description: 'Alright!',
        // status: 'success',
        duration: 5000,
        isClosable: true
      })
    }
  }

  const renderSwitch = ({ name, type, isRequired }) => {
    switch (type) {
      case 'longtext':
        return (
          <>
            <Textarea
              rows='6'
              name={name}
              {...register(name, {
                required: isRequired && 'Write in this field, son of a bitch'
              })}
            />
            {isRequired && errors[name] && errors[name].message}
          </>
        )
      case 'image':
        return <TextAreaImage name={name} isRequired={isRequired} />
      case 'text':
        return (
          <>
            <Input
              name={name}
              {...register(name, {
                required: isRequired && 'Write in this field, son of a bitch'
              })}
            />
            {isRequired && errors[name] && errors[name].message}
          </>
        )
      case 'richtext': {
        haveEditor.current = true
        return (
          <TipTap
            id='editor'
            onSubmit={onSubmit}
            setEditorContent={setEditorContent}
          />
        )
      }
    }
  }

  return (
    <>
      <Header back={true} title={`Creating ${type.slice(0, -1)}`}>
        <CreateDocButton type={type} />
      </Header>
      <PageTransitionAnimation>
        {schema && (
          <Box m='20px'>
            <form id='create-doc' onSubmit={handleSubmitHook(handleSubmit)}>
              {Object.keys(schema).map((key, i) => {
                let name = key
                let type = schema[key].type
                let isRequired = schema[key].isRequired
                return (
                  <EditDataTypeInputWrapper key={i}>
                    <Label w='100%' key={i}>
                      {capitalizeFirstLetter(key)}
                    </Label>
                    {renderSwitch({ name, type, isRequired })}
                  </EditDataTypeInputWrapper>
                )
              })}
            </form>
          </Box>
        )}
      </PageTransitionAnimation>
    </>
  )
}

export default Create
