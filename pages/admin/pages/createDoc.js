// React / Next
import React, { useEffect, useState, useRef } from 'react'
import { useParams, useHistory } from 'react-router-dom'

// Styles
import { Label } from '../styles'

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
import { Box } from '@chakra-ui/react'
import PageTransitionAnimation from '@/admin/atoms/pageTransitionAnimation'
import CreateDocButton from '@/admin/atoms/createDocButton'
import Header from '@/admin/components/header'
import AddRelatedDocModal from '@/admin/components/addRelatedDocModal'
import AddedRelatedDocs from '@/admin/components/addedRelatedDocs'
import DocFormFieldWrapper from '@/admin/components/layouts/docFormFieldWrapper'
import DocForm from '@/admin/components/docForm'

// Hooks
import useStore from '@/admin/store/store'
import { useDisplayToast } from '@/admin/hooks/toast'

const Create = () => {
  const [schema, setSchema] = useState()
  const [relations, setRelations] = useState([])
  const imgURL = useStore(state => state.imgURL)
  const editorContent = useRef(null)
  const [onSubmit, setOnSubmit] = useState()
  const newContent = useRef(null)
  const haveEditor = useRef(false)
  const { type } = useParams()
  const [schemaSorted, setSchemaSorted] = useState(null)
  const history = useHistory()
  const [selectedRowIds, setSelectedRowIds] = useState([])
  const displayToast = useDisplayToast()

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
      displayToast({
        title: 'Content Created Successfully',
        description: 'Alright!'
      })
      history.goBack()
    }
  }, [editorContent.current])

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

  const getRelations = async () => {
    getFullSchemaByType(type).then(async data => {
      if (data.length > 0 && data[0].relations?.length > 0) {
        const relatedCollections = []
        data[0].relations.forEach((junction, i) => {
          const { type2 } = getTypes(junction.name, type)
          relatedCollections.push({ type: type2, junction: junction.name })
        })
        setRelations(relatedCollections)
      }
    })
  }

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
    // else {
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
    displayToast({
      title: 'Content Created Successfully',
      description: 'Alright!'
    })
    history.goBack()
  }

  return (
    <>
      <Header back={true} title={`Creating ${type.slice(0, -1)}`}>
        <CreateDocButton type={type} />
      </Header>
      <PageTransitionAnimation>
        {/* Showing fields with Doc data */}
        {schema && (
          <Box m='20px'>
            <DocForm
              schema={schemaSorted}
              transformDataForTypeInput={transformDataForTypeInput}
              id='create-doc'
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
