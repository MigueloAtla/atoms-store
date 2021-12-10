// React/Next
import React, { useEffect, useRef, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'

// Firebase
import {
  getSchemaByType,
  fetchOneByType,
  updateOneByType,
  fetchRelatedDocs,
  getFullSchemaByType,
  addByCollectionTypeWithCustomIDBatched,
  deleteRelatedDoc
} from '@/firebase/client'

// Components
import UpdateButton from '@/admin/atoms/UpdateButton'
import PageTransitionAnimation from '@/admin/atoms/pageTransitionAnimation'
import LoaderScreen from '@/admin/atoms/loadScreen'
import PreviewDrawer from '@/admin/atoms/previewDrawer'
import DocFormFieldWrapper from '@/admin/components/layouts/docFormFieldWrapper'
import { Box, useToast, Button } from '@chakra-ui/react'
import Header from '../components/header'
import AddRelatedDocModal from '@/admin/components/addRelatedDocModal'
import AddedRelatedDocs from '@/admin/components/addedRelatedDocs'
import TypeInput from '@/admin/components/atoms/typeInput'
import DocForm from '@/admin/components/docForm'

// Styles
import { Label } from '../styles'

// Utils
import { capitalizeFirstLetter, getTypes } from '@/admin/utils/utils'

// Hooks
import { useForm, FormProvider } from 'react-hook-form'
import useStore from '../store/store'

const Edit = () => {
  let history = useHistory()
  const [schema, setSchema] = useState()
  const [relations, setRelations] = useState([])
  const [content, setContent] = useState(null)
  const imgURL = useStore(state => state.imgURL)
  const setImgURL = useStore(state => state.setImgURL)
  const globalId = useStore(state => state.id)
  const editorContent = useRef(null)
  const [onSubmit, setOnSubmit] = useState()
  const { id, type } = useParams()
  const contentCloned = useRef(null)
  const haveEditor = useRef(false)
  const updateRef = useRef(false)
  const [selectedRowIds, setSelectedRowIds] = useState([])
  const setLoading = useStore(state => state.setLoading)
  const selectedCollectionName = useStore(state => state.selectedCollectionName)
  const setSelectedCollectionName = useStore(
    state => state.setSelectedCollectionName
  )
  const [schemaSorted, setSchemaSorted] = useState(null)
  const loading = useStore(state => state.loading)

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
  }, [globalId, id])

  const getRelatedDoc = async junction => {
    const { type1, type2 } = getTypes(junction, type)
    const relationsFetched = await fetchRelatedDocs(id, junction, type1, type2)
    const prevState = relations
    const newState = prevState.map(collection => {
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
              relatedDocs = await fetchRelatedDocs(
                id,
                junction.name,
                type1,
                type2
              )
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

  const transformDataForTypeInput = el => {
    let name = el[0]
    let obj = el[1]
    return { obj, name }
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
            <Box m='80px'>
              <DocForm
                schema={schemaSorted}
                transformDataForTypeInput={transformDataForTypeInput}
                id='edit-form'
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                editorContent={editorContent}
                haveEditor={haveEditor}
              />

              {/* Showing related Docs */}
              {relations.length > 0 &&
                relations.map((relation, i) => {
                  return (
                    <DocFormFieldWrapper key={i}>
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

                          <AddedRelatedDocs
                            selectedRowIds={selectedRowIds}
                            relatedDocType={relation.collection}
                            type={type}
                            setSelectedRowIds={setSelectedRowIds}
                          />
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
                                    let composedId
                                    const spliceRelations = relation.junctionName.split(
                                      '_'
                                    )
                                    if (spliceRelations[1] === type) {
                                      composedId = `${id}_${doc.id}`
                                    } else {
                                      composedId = `${doc.id}_${id}`
                                    }
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
                    </DocFormFieldWrapper>
                  )
                })}
            </Box>
          )}
        </PageTransitionAnimation>
      )}
    </Box>
  )
}

export default Edit
