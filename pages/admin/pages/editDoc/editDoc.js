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
import { RelatedDocs } from '@/admin/components/relatedDocs'
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
            relations.map((rel, i) => {
              return (
                <DocFormFieldWrapper bg='secondary_bg' key={i}>
                  <Label w='100%'>
                    {capitalizeFirstLetter(rel.collection)}
                  </Label>
                  {'content' in rel ? (
                    <div>
                      
                      {/* modal to show the related type docs */}
                      <AddRelatedDocModal
                        collection={rel.collection}
                        type={type}
                        junctionName={rel.junctionName}
                        content={rel.content}
                        id={id}
                        setSelectedRowIds={setSelectedRowIds}
                      />
                      
                      {/* related docs, selected from the modal, before save to db */}
                      <AddedRelatedDocs
                        selectedRowIds={selectedRowIds}
                        relatedDocType={rel.collection}
                        type={type}
                        setSelectedRowIds={setSelectedRowIds}
                      />

                      {/* related docs already added on db  */}
                      <RelatedDocs 
                        relation={rel} 
                        removeList={removeList}
                        setRemoveList={setRemoveList} 
                        type={type} 
                        id={id} 
                      />
                    </div>
                  ) : (
                    <div>
                      <Button
                        onClick={() => {
                          showRelatedDocs(rel.junctionName)
                        }}
                      >
                        show {rel.collection}
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
})(Edit)

  