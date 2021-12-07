// React/Next
import React, { useEffect, useRef, useState } from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'

// Firebase
import {
  getSchemaByType,
  fetchOneByType,
  updateOneByType,
  fetchProducts,
  getFullSchemaByType,
  getCollection,
  addByCollectionTypeWithCustomID,
  addByCollectionTypeWithCustomIDBatched,
  deleteRelatedDoc
} from '@/firebase/client'

// Components
import UpdateButton from '@/admin/atoms/UpdateButton'
import PageTransitionAnimation from '@/admin/atoms/pageTransitionAnimation'
import LoaderScreen from '@/admin/atoms/loadScreen'
import PreviewDrawer from '@/admin/atoms/previewDrawer'
import EditDataTypeInputWrapper from '@/admin/layouts/editDataTypeInputWrapper'

import { Input, Box, useToast, Button, Flex, Text } from '@chakra-ui/react'

// Components
import TipTap from '../components/editor'
import Header from '../components/header'
import TextAreaImage from '@/admin/components/atoms/textAreaImage'
import AddRelatedDocModal from '@/admin/components/addRelatedDocModal'
import AddedRelatedDoc from '@/admin/components/addedRelatedDoc'

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
  let history = useHistory()
  const [schema, setSchema] = useState()
  // const [relatedCollectionsState, setRelatedCollectionsState] = useState([])
  const [relations, setRelations] = useState([])
  const [relatedCollection, setRelatedCollection] = useState([])
  const [content, setContent] = useState(null)
  const imgURL = useStore(state => state.imgURL)
  const setImgURL = useStore(state => state.setImgURL)
  const setId = useStore(state => state.setId)
  const globalId = useStore(state => state.id)
  const editorContent = useRef(null)
  const [onSubmit, setOnSubmit] = useState()
  const { id, type } = useParams()
  const contentCloned = useRef(null)
  const relatedJunction = useRef(null)
  const haveEditor = useRef(false)
  const updateRef = useRef(false)
  const relatedDocRef = useRef([])
  const [selectedRowIds, setSelectedRowIds] = useState([])
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

  // get related collection
  const getRelationCollection = junction => {
    console.log('adding a relation')
    // get all products on modal
    relatedJunction.current = junction
    const { type1, type2 } = getTypes(junction)
    getCollection(type2).then(r => {
      setRelatedCollection(r)
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
  }, [globalId, id])

  const getTypes = junction => {
    console.log('get types')
    console.log(junction)
    const spliceRelations = junction.split('_')
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

  const getRelatedDoc = async junction => {
    const { type1, type2 } = getTypes(junction)
    const relationsFetched = await fetchProducts(id, junction, type1, type2)
    const prevState = relations
    const newState = prevState.map(collection => {
      console.log(collection.collection)
      if (collection.collection === type2) {
        return {
          content: [...relationsFetched],
          collection: type2,
          junctionName: junction
        }
      } else return collection
    })
    setRelations(newState)
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
        // const relatedCollections = []
        data[0].relations.forEach((junction, i) => {
          const { type2 } = types(junction)
          // relatedCollections.push(type2)
          if (junction.display === true) {
            const promise = new Promise(async (resolve, reject) => {
              const { type1, type2 } = types(junction)
              relatedDocs = await fetchProducts(id, junction.name, type1, type2)
              resolve({
                content: [...relatedDocs],
                collection: type2,
                junctionName: junction.name
              })
            })
            promises.push(promise)
          } else {
            const promise = new Promise(async (resolve, reject) => {
              resolve({ junctionName: junction.name, collection: type2 })
            })
            promises.push(promise)
          }
        })
        if (promises.length > 0) {
          await Promise.all(promises).then(resolved => {
            setRelations([...resolved])
          })
        }
      }
    })
  }

  useEffect(() => {
    console.log(relations)
  }, [relations])

  useEffect(() => {
    if (content) {
      Object.keys(content).map(key => {
        if (content[key].type === 'image' && content[key].value !== '') {
          setImgURL(content[key].value)
        }
      })
      getRelations()
    }
  }, [content])

  useEffect(() => {
    if (haveEditor.current && contentCloned.current) {
      contentCloned.current['content'].value = editorContent.current
    }
    if (updateRef.current === true) {
      updateOneByType(id, type, contentCloned.current)

      selectedRowIds.map(s => {
        let idsArr = []
        let docsContent = []
        Object.keys(s).map(entry => {
          const spliceRelations = entry.split('_')
          s[entry].map(({ id: currentId }) => {
            console.log(entry)
            console.log(currentId)
            let type1
            let type2
            let composedId

            // Compose ids
            if (spliceRelations[1] === type) {
              composedId = `${id}_${currentId}`
              type1 = spliceRelations[1]
              type2 = spliceRelations[2]
            } else {
              composedId = `${currentId}_${id}`
              type1 = spliceRelations[2]
              type2 = spliceRelations[1]
            }
            idsArr.push(composedId)

            // Prepare content of Doc
            docsContent.push({
              [`${type1}Id`]: id,
              [`${type2}Id`]: currentId
            })
          })

          // Create doc and junction collection if no exists yet
          addByCollectionTypeWithCustomIDBatched(entry, idsArr, docsContent)
        })
      })

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

  useEffect(() => {
    console.log(selectedRowIds)
  }, [selectedRowIds])

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

                {relations.length > 0 &&
                  relations.map((relation, i) => {
                    return (
                      <EditDataTypeInputWrapper key={i} direction='row'>
                        <Label w='100%'>
                          {capitalizeFirstLetter(relation.collection)}
                        </Label>
                        {'content' in relation ? (
                          <div>
                            <AddRelatedDocModal
                              collection={relation.collection}
                              junctionName={relation.junctionName}
                              content={relation.content}
                              type={type}
                              id={id}
                              setSelectedRowIds={setSelectedRowIds}
                            />

                            <AddedRelatedDoc
                              selectedRowIds={selectedRowIds}
                              relatedDocType={relation.collection}
                              type={type}
                              setSelectedRowIds={setSelectedRowIds}
                            />

                            {/* {selectedRowIds.length > 0 &&
                              selectedRowIds.map((selected, i) => {
                                console.log(selected)
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
                                  if (relation.collection === type2) {
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
                                              let arr = selected[key].filter(
                                                item => {
                                                  return item.id !== s.id
                                                }
                                              )
                                              let newState = selectedRowIds

                                              selectedRowIds.map(
                                                (selectedRow, i) => {
                                                  Object.keys(selectedRow).map(
                                                    selectDelKey => {
                                                      if (
                                                        selectDelKey === key
                                                      ) {
                                                        newState[i][
                                                          selectDelKey
                                                        ] = arr
                                                      }
                                                    }
                                                  )
                                                }
                                              )
                                              setSelectedRowIds(
                                                Array.from(newState)
                                              )
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
                            {relation.content.map(doc => {
                              return (
                                <div
                                  key={doc.id}
                                  onClick={e => {
                                    history.push(
                                      `/admin/${relation.collection}/${doc.id}`
                                    )
                                  }}
                                >
                                  {Object.keys(doc).map(docField => {
                                    if (docField !== 'id') {
                                      return (
                                        <p>
                                          {docField}: {doc[docField].value}
                                        </p>
                                      )
                                    }
                                  })}
                                  <Button
                                    onClick={e => {
                                      e.stopPropagation()
                                      console.log(doc.id)
                                      console.log(id)
                                      let composedId
                                      let type1, type2
                                      const spliceRelations = relation.junctionName.split(
                                        '_'
                                      )
                                      if (spliceRelations[1] === type) {
                                        composedId = `${id}_${doc.id}`
                                        type1 = spliceRelations[1]
                                        type2 = spliceRelations[2]
                                      } else {
                                        composedId = `${doc.id}_${id}`
                                        type1 = spliceRelations[2]
                                        type2 = spliceRelations[1]
                                      }
                                      console.log(composedId)

                                      deleteRelatedDoc(
                                        relation.junctionName,
                                        composedId
                                      )
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <div>
                            <Button
                              onClick={() => {
                                getRelatedDoc(relation.junctionName)
                              }}
                            >
                              show {relation.collection}
                            </Button>
                          </div>
                        )}
                      </EditDataTypeInputWrapper>
                    )
                  })}
              </Box>
            </>
          )}
        </PageTransitionAnimation>
      )}
    </Box>
  )
}

export default Edit
