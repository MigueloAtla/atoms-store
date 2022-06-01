// React/Next
import { useHistory } from 'react-router-dom'

// Firebase
import {
  getAndMapHiddenRelatedDocs
} from '@/firebase/client'

// Components
import withPageHoc from '../pageHoc'
import DocFormFieldWrapper from '@/admin/components/layouts/docFormFieldWrapper'
import { Box, Button } from '@chakra-ui/react'
import AddRelatedDocModal from '@/admin/components/addRelatedDocModal'
import AddedRelatedDocs from '@/admin/components/addedRelatedDocs'
import DocForm from '@/admin/components/docForm'
import * as Buttons from './buttons'

// Styles
import { Label } from '../../styles'

// Utils
import { capitalizeFirstLetter } from '@/admin/utils/utils'

// Hooks
import { useControllerHook } from './editControllerHook'
import { useEditForm } from './editFormHook'
import { useEvents } from './events'

const Edit = ({
  type,
  id,
  relations,
  content,
  contentFormatted,
  setRelations,
  haveEditor,
  onSubmit,
  transformDataForTypeInput,
  handleSubmit,
  editorContent,
  formUtils,
  setSelectedRowIds,
  selectedRowIds,
  removeList,
  setRemoveList
}) => {
  let history = useHistory()

  const showRelatedDocs = async junction => {
    // adds to the related docs array the hidden ones
    setRelations(await getAndMapHiddenRelatedDocs(id, junction, type, relations))
  }

  return (
    <Box minH='calc(100% - 50px)'>

      {content && (
        <Box m='80px'>
          <DocForm
            schema={contentFormatted}
            transformDataForTypeInput={transformDataForTypeInput}
            id='edit-form'
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            editorContent={editorContent}
            haveEditor={haveEditor}
            formUtils={formUtils}
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
                      
                      {/* modal to show the related type docs */}
                      <AddRelatedDocModal
                        collection={relation.collection}
                        type={type}
                        junctionName={relation.junctionName}
                        content={relation.content}
                        id={id}
                        setSelectedRowIds={setSelectedRowIds}
                      />
                      
                      {/* related docs, selected from the modal, before save to db */}
                      <AddedRelatedDocs
                        selectedRowIds={selectedRowIds}
                        relatedDocType={relation.collection}
                        type={type}
                        setSelectedRowIds={setSelectedRowIds}
                      />

                      {/* related docs already added on db  */}
                      {relation.content.map(doc => {
                        let composedId
                        const spliceRelations = relation.junctionName.split(
                          '_'
                        )
                        if (spliceRelations[1] === type) {
                          composedId = `${id}_${doc.id}`
                        } else {
                          composedId = `${doc.id}_${id}`
                        }
                        const ids = removeList.map(el => el.id)

                        return (
                          <div
                            key={doc.id}
                            onClick={e => {
                              history.push(
                                `/admin/${relation.collection}/${doc.id}`
                              )
                            }}
                            style={{
                              backgroundColor: ids.includes(composedId) ? '#000' : '#fff',
                            }}
                          >
                            {Object.keys(doc).map((docField, i) => {
                              if (docField !== 'id') {
                                return (
                                  <p key={i}>
                                    {docField}: {doc[docField].value}
                                  </p>
                                )
                              }
                            })}
                            {ids.includes(composedId) ? <Button
                              onClick={e => {
                                e.stopPropagation()
                                let filtered_removelist = removeList.filter(el => el.id !== composedId)
                                setRemoveList(() => [...filtered_removelist])
                              }}
                            >
                              Undo Delete
                            </Button>
                            :
                            <Button
                              onClick={e => {
                                e.stopPropagation()
                                setRemoveList((prevState) => [...prevState, {id: composedId, junction: relation.junctionName}])
                              }}
                            >
                              Delete
                            </Button>
                            }
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div>
                      <Button
                        onClick={() => {
                          showRelatedDocs(relation.junctionName)
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
    </Box>
  )
}

export default withPageHoc({
  controller: useControllerHook,
  form: {
    hook: useEditForm
  },
  header: {
    back: true,
    title: '::doc'
  },
  buttons: Buttons,
  events: {
    hook: useEvents,
    load: 'doc',
    update: {
      msg: 'Document updated successfully',
      description: 'Alright!'
    }
  },
  allowed_roles: ['admin', 'editor'],
  // useLoading: true
})(Edit)

  