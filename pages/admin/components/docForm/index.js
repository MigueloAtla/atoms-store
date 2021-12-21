import React from 'react'
import styled from 'styled-components'

// Components
import DocFormFieldWrapper from '@/admin/components/layouts/docFormFieldWrapper'
import TypeInput from '@/admin/components/atoms/typeInput'
import { Label } from '@/admin/styles'
import ModalShortcuts from '@/admin/components/modals/modalShortcuts'
import { Box, Button, Flex } from '@chakra-ui/react'

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
  haveEditor,
  formUtils
}) => {
  const setSmallImageEditor = useStore(state => state.setSmallImageEditor)
  const setExpandedEditor = useStore(state => state.setExpandedEditor)
  const smallImageEditor = useStore(state => state.smallImageEditor)
  const expandedEditor = useStore(state => state.expandedEditor)

  const {
    register,
    handleSubmit: handleSubmitHook,
    formState: { errors },
    setValue
  } = formUtils

  return (
    <FormProvider {...{ register, errors, setValue }}>
      <form id={id} onSubmit={handleSubmitHook(handleSubmit)}>
        {schema &&
          schema.map((el, i) => {
            let { obj, name } = transformDataForTypeInput(el)
            let isEditor = el[1].type === 'richtext'
            let expanded = expandedEditor && isEditor
            return (
              <DocFormFieldWrapper key={i} $expanded={expanded ? 1 : 0}>
                <Label w='100%' key={i}>
                  {capitalizeFirstLetter(name)}
                </Label>
                {isEditor && (
                  <DocFormFieldWrapperButtons>
                    <Button
                      onClick={() => {
                        setSmallImageEditor(!smallImageEditor)
                      }}
                    >
                      small
                    </Button>
                    <Button
                      onClick={() => {
                        setExpandedEditor(!expandedEditor)
                      }}
                    >
                      expand
                    </Button>
                    <ModalShortcuts />
                  </DocFormFieldWrapperButtons>
                )}
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

const DocFormFieldWrapperButtons = styled(Flex)`
  position: absolute;
  top: 10px;
  right: 20px;
  gap: 15px;
`
