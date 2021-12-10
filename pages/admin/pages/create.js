// React / Next
import React, { useEffect, useState, useRef } from 'react'
import { useParams, useHistory } from 'react-router-dom'

// Styles
import { Label } from '../styles'

// Ui
import { Textarea, Input, useToast, Box } from '@chakra-ui/react'

// Firebase
import {
  getSchemaByType,
  addByCollectionType,
  getFullSchemaByType,
  addByCollectionTypeWithCustomIDBatched
} from '@/firebase/client'

// Utils
import { capitalizeFirstLetter, getTypes } from '@/admin/utils/utils'

// Components
import PageTransitionAnimation from '@/admin/atoms/pageTransitionAnimation'
import TipTap from '../components/editor'
import CreateDocButton from '@/admin/atoms/createDocButton'
import Header from '@/admin/components/header'
import TextAreaImage from '@/admin/components/atoms/textAreaImage'
import AddRelatedDocModal from '@/admin/components/addRelatedDocModal'
import AddedRelatedDocs from '@/admin/components/addedRelatedDocs'
import DocFormFieldWrapper from '@/admin/components/layouts/docFormFieldWrapper'

// Hooks
import { useForm } from 'react-hook-form'
import useStore from '@/admin/store/store'

const Create = () => {
  const [schema, setSchema] = useState()
  const [relations, setRelations] = useState([])
  const imgURL = useStore(state => state.imgURL)
  const editorContent = useRef(null)
  const [onSubmit, setOnSubmit] = useState()
  const newContent = useRef(null)
  const haveEditor = useRef(false)
  const toast = useToast()
  const { type } = useParams()
  const [schemaSorted, setSchemaSorted] = useState(null)
  const history = useHistory()
  const [selectedRowIds, setSelectedRowIds] = useState([])

  const {
    register,
    handleSubmit: handleSubmitHook,
    formState: { errors }
  } = useForm()

  // OnMount: get metadata of the Collection
  useEffect(() => {
    type &&
      getSchemaByType(type).then(res => {
        setSchema(res[0])
      })
  }, [])

  useEffect(() => {
    if (newContent.current) {
      newContent.current['content'].value = editorContent.current
      addByCollectionType(type, newContent.current)
      showToastAndGoBack()
    }
  }, [editorContent.current])

  const handleSubmit = data => {
    // Prepare data before write in DB
    newContent.current = {}

    Object.keys(schema).map(s => {
      if (schema[s].type === 'image') {
        newContent.current[s] = {
          type: schema[s].type,
          value: imgURL || '',
          isRequired: schema[s].isRequired,
          order: schema[s].order
        }
      } else {
        newContent.current[s] = {
          type: schema[s].type,
          value: data[s] || '',
          isRequired: schema[s].isRequired,
          order: schema[s].order
        }
      }
    })

    if (haveEditor.current === true) setOnSubmit(!onSubmit)
    else {
      // Create the Doc and get the generated ID
      addByCollectionType(type, newContent.current).then(function (docRef) {
        let newId = docRef.id

        // map selectedRowIds
        selectedRowIds.map(s => {
          let idsArr = []
          let docsContent = []
          Object.keys(s).map(entry => {
            const spliceRelations = entry.split('_')
            s[entry].map(({ id: currentId }) => {
              let type1
              let type2
              let composedId

              // Compose ids
              if (spliceRelations[1] === type) {
                composedId = `${newId}_${currentId}`
                type1 = spliceRelations[1]
                type2 = spliceRelations[2]
              } else {
                composedId = `${currentId}_${newId}`
                type1 = spliceRelations[2]
                type2 = spliceRelations[1]
              }
              idsArr.push(composedId)

              // Prepare content of Doc
              docsContent.push({
                [`${type1}Id`]: newId,
                [`${type2}Id`]: currentId
              })
            })

            // Create Doc and junction collection if no exists yet
            addByCollectionTypeWithCustomIDBatched(entry, idsArr, docsContent)
          })
        })
      })
      showToastAndGoBack()
    }
  }

  // After Doc is created
  const showToastAndGoBack = () => {
    toast({
      title: 'Content Created Successfully',
      position: 'bottom-right',
      variant: 'subtle',
      description: 'Alright!',
      duration: 5000,
      isClosable: true
    })
    history.goBack()
  }

  // Generate the fields to render in the form, based on the type of each field
  const renderDataInput = ({ name, type, isRequired }) => {
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
            editorContent={editorContent}
          />
        )
      }
    }
  }

  const getRelations = async () => {
    getFullSchemaByType(type).then(async data => {
      if (data.length > 0 && data[0].relations?.length > 0) {
        const promises = []
        const relatedCollections = []
        data[0].relations.forEach((junction, i) => {
          const { type2 } = getTypes(junction.name, type)
          relatedCollections.push({ type: type2, junction: junction.name })
        })
        setRelations(relatedCollections)
      }
    })
  }

  // When Collection metadata is fetched, sort the fields in order
  // before they are rendered, and get related Docs
  useEffect(() => {
    if (schema) {
      let schemaSortedArr = Object.entries(schema).sort(function (a, b) {
        return a[1].order - b[1].order
      })
      setSchemaSorted(schemaSortedArr)
      getRelations()
    }
  }, [schema])

  return (
    <>
      <Header back={true} title={`Creating ${type.slice(0, -1)}`}>
        <CreateDocButton type={type} />
      </Header>
      <PageTransitionAnimation>
        {/* Showing fields with Doc data */}
        {schema && (
          <Box m='20px'>
            <form id='create-doc' onSubmit={handleSubmitHook(handleSubmit)}>
              {schemaSorted &&
                schemaSorted.map((el, i) => {
                  let name = el[0]
                  let type = el[1].type
                  let isRequired = el[1].isRequired
                  let order = el[1].order
                  return (
                    <DocFormFieldWrapper key={i}>
                      <Label w='100%' key={i}>
                        {capitalizeFirstLetter(name)}
                      </Label>
                      {renderDataInput({ name, type, isRequired, order })}
                    </DocFormFieldWrapper>
                  )
                })}
            </form>

            {/* Showing related Docs */}
            {relations.length > 0 &&
              relations.map((relation, i) => {
                return (
                  <DocFormFieldWrapper key={i}>
                    <Label w='100%'>
                      {capitalizeFirstLetter(relation.type)}
                    </Label>
                    <AddRelatedDocModal
                      collection={relation.type}
                      junctionName={relation.junction}
                      type={type}
                      setSelectedRowIds={setSelectedRowIds}
                    />

                    <AddedRelatedDocs
                      selectedRowIds={selectedRowIds}
                      relatedDocType={relation.type}
                      type={type}
                      setSelectedRowIds={setSelectedRowIds}
                    />
                  </DocFormFieldWrapper>
                )
              })}
          </Box>
        )}
      </PageTransitionAnimation>
    </>
  )
}

export default Create
