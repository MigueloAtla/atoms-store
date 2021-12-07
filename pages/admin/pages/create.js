// React / Next
import React, { useEffect, useState, useRef } from 'react'
import { useParams, useHistory } from 'react-router-dom'

// Styles
import { Label } from '../styles'

// Ui
import { Textarea, Input, useToast, Box, Button, Flex } from '@chakra-ui/react'

// Firebase
import {
  getSchemaByType,
  addByCollectionType,
  getFullSchemaByType,
  fetchProducts,
  addByCollectionTypeWithCustomIDBatched
} from '@/firebase/client'

// Utils
import { capitalizeFirstLetter } from '../utils/utils'

// Components
import TipTap from '../components/editor'
import CreateDocButton from '@/admin/atoms/createDocButton'
import Header from '@/admin/components/header'
import TextAreaImage from '@/admin/components/atoms/textAreaImage'
import AddRelatedDocModal from '@/admin/components/addRelatedDocModal'
import AddedRelatedDoc from '@/admin/components/addedRelatedDoc'
// Hooks
import { useForm } from 'react-hook-form'
import EditDataTypeInputWrapper from '@/admin/layouts/editDataTypeInputWrapper'
import PageTransitionAnimation from '@/admin/atoms/pageTransitionAnimation'

// Store
import useStore from '@/admin/store/store'

const Create = () => {
  const [schema, setSchema] = useState()
  const [relations, setRelations] = useState([])
  const [update, setUpdate] = useState([])
  const imgURL = useStore(state => state.imgURL)
  const editorContent = useRef(null)
  const [onSubmit, setOnSubmit] = useState()
  const newContent = useRef(null)
  const haveEditor = useRef(false)
  const toast = useToast()
  const { type } = useParams()
  const [schemaSorted, setSchemaSorted] = useState(null)
  const history = useHistory()
  const relatedDocRef = useRef([])
  // const selectedRowIds = useRef([])
  const [selectedRowIds, setSelectedRowIds] = useState([])

  const {
    register,
    handleSubmit: handleSubmitHook,
    formState: { errors }
  } = useForm()

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
  }, [editorContent.current])

  const handleSubmit = data => {
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

            // Create doc and junction collection if no exists yet
            addByCollectionTypeWithCustomIDBatched(entry, idsArr, docsContent)
          })
        })
      })
      toast({
        title: 'Content Created Successfully',
        position: 'bottom-right',
        variant: 'subtle',
        description: 'Alright!',
        // status: 'success',
        duration: 5000,
        isClosable: true
      })
      history.goBack()
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
            editorContent={editorContent}
          />
        )
      }
    }
  }

  const getRelations = async () => {
    let relatedDocs = []

    const types = junction => {
      const spliceRelations = junction.name.split('_')
      let type1, type2
      if (spliceRelations[1] === type) {
        type1 = spliceRelations[1]
        type2 = spliceRelations[2]
      } else {
        type1 = spliceRelations[2]
        type2 = spliceRelations[1]
      }
      return { type1, type2 }
    }

    getFullSchemaByType(type).then(async data => {
      if (data.length > 0 && data[0].relations?.length > 0) {
        const promises = []
        const relatedCollections = []
        data[0].relations.forEach((junction, i) => {
          console.log(junction)
          const { type2 } = types(junction)
          relatedCollections.push({ type: type2, junction: junction.name })
        })
        setRelations(relatedCollections)
      }
    })
  }

  useEffect(() => {
    if (schema) {
      console.log(schema)
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
                    <EditDataTypeInputWrapper key={i}>
                      <Label w='100%' key={i}>
                        {capitalizeFirstLetter(name)}
                      </Label>
                      {renderSwitch({ name, type, isRequired, order })}
                    </EditDataTypeInputWrapper>
                  )
                })}
            </form>
            {relations.length > 0 &&
              relations.map((relation, i) => {
                return (
                  <EditDataTypeInputWrapper key={i} direction='row'>
                    <Label w='100%'>
                      {capitalizeFirstLetter(relation.type)}
                    </Label>
                    <AddRelatedDocModal
                      collection={relation.type}
                      junctionName={relation.junction}
                      type={type}
                      setSelectedRowIds={setSelectedRowIds}
                    />

                    <AddedRelatedDoc
                      selectedRowIds={selectedRowIds}
                      relatedDocType={relation.type}
                      type={type}
                      setSelectedRowIds={setSelectedRowIds}
                    />

                    {/* {selectedRowIds.length > 0 &&
                      selectedRowIds.map((selected, i) => {
                        return Object.keys(selected).map(key => {
                          let spliceRelations = key.split('_')
                          let type1, type2
                          if (spliceRelations[1] === type) {
                            type1 = spliceRelations[1]
                            type2 = spliceRelations[2]
                          } else {
                            type1 = spliceRelations[2]
                            type2 = spliceRelations[1]
                          }
                          if (relation.type === type2) {
                            return selected[key].map((s, i) => {
                              return (
                                <Flex
                                  key={i}
                                  height='50px'
                                  mt='20px'
                                  justifyContent='space-between'
                                >
                                  {Object.keys(s).map((subkey, i) => {
                                    return (
                                      <div key={i}>
                                        <div>{s[subkey]}</div>
                                      </div>
                                    )
                                  })}
                                  <Button
                                    height='30px'
                                    onClick={() => {
                                      // onDelete row
                                      let arr = selected[key].filter(item => {
                                        return item.id !== s.id
                                      })
                                      let newState = selectedRowIds

                                      selectedRowIds.map((selectedRow, i) => {
                                        Object.keys(selectedRow).map(
                                          selectDelKey => {
                                            if (selectDelKey === key) {
                                              newState[i][selectDelKey] = arr
                                            }
                                          }
                                        )
                                      })
                                      setSelectedRowIds(Array.from(newState))
                                    }}
                                  >
                                    remove
                                  </Button>
                                </Flex>
                              )
                            })
                          }
                        })
                      })} */}
                  </EditDataTypeInputWrapper>
                )
              })}
          </Box>
        )}
      </PageTransitionAnimation>
    </>
  )
}

export default Create
