// Styles
import { Label } from '../../styles'

// Utils
import { capitalizeFirstLetter } from '@/admin/utils/utils'

// Components
import { Box } from '@chakra-ui/react'
import AddRelatedDocModal from '@/admin/components/addRelatedDocModal'
import AddedRelatedDocs from '@/admin/components/addedRelatedDocs'
import DocFormFieldWrapper from '@/admin/components/layouts/docFormFieldWrapper'
import DocForm from '@/admin/components/docForm'
import * as Buttons from './buttons'

// HOC
import withPageHoc from '../pageHoc'

// Hooks
import { useControllerHook } from './createDocHook'
import { useFormHook } from './formHook'

const Create = ({
  type,
  schema,
  relations,
  selectedRowIds,
  setSelectedRowIds,
  formUtils,
  handleSubmit,
  transformDataForTypeInput,
  onSubmit,
  editorContent,
  haveEditor,
}) => {
  return (
    <>
      {/* Showing fields with Doc data */}
      {schema && (
        <Box m='20px'>
          <DocForm
            schema={schema}
            transformDataForTypeInput={transformDataForTypeInput}
            id='create-doc'
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
    </>
  )
}

export default withPageHoc({
  controller: useControllerHook,
  form: {
    hook: useFormHook,
  },
  header: {
    back: true,
    title: 'content'
  },
  events: {
    hook: () => {},
    update: null,
    load: 'schema',
    created: {
      msg: 'Document created successfully',
      description: 'Allright!'
    }
  },
  buttons: Buttons,
  allowed_roles: ['admin', 'editor']
})(Create)
