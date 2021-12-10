import React from 'react'

// Components
import DocFormFieldWrapper from '@/admin/components/layouts/docFormFieldWrapper'
import TypeInput from '@/admin/components/atoms/typeInput'
import { Label } from '@/admin/styles'

// Hooks
import { useForm, FormProvider } from 'react-hook-form'
import useStore from '@/admin/store/store'

// Utils
import { capitalizeFirstLetter } from '@/admin/utils/utils'

const DocForm = ({
  schema,
  transformDataForTypeInput,
  id,
  handleSubmit,
  onSubmit,
  editorContent,
  haveEditor
}) => {
  const expandedEditor = useStore(state => state.expandedEditor)

  const {
    register,
    handleSubmit: handleSubmitHook,
    formState: { errors },
    setValue
  } = useForm()

  return (
    <FormProvider {...{ register, errors, setValue }}>
      <form id={id} onSubmit={handleSubmitHook(handleSubmit)}>
        {schema &&
          schema.map((el, i) => {
            let { obj, name } = transformDataForTypeInput(el)
            let expanded = expandedEditor && el[1].type === 'richtext'
            return (
              <DocFormFieldWrapper key={i} $expanded={expanded ? 1 : 0}>
                <Label w='100%' key={i}>
                  {capitalizeFirstLetter(name)}
                </Label>
                <TypeInput
                  obj={obj}
                  name={name}
                  onSubmit={onSubmit}
                  editorContent={editorContent}
                  haveEditor={haveEditor}
                />
              </DocFormFieldWrapper>
            )
          })}
      </form>
    </FormProvider>
  )
}

export default DocForm
