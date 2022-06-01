// NOT IN USE, idea for a refactor...
import DocForm from '@/admin/components/docForm'

// Hooks
import { useForm } from 'react-hook-form'

const EditDocForm = () => {

  const formUtils = useForm()
  const { handleSubmit: handleSubmitHook } = formUtils

  const transformDataForTypeInput = el => {
    let name = el[0]
    let obj = el[1]
    return { obj, name }
  }

  return <DocForm
    schema={contentFormatted}
    transformDataForTypeInput={transformDataForTypeInput}
    id='edit-form'
    handleSubmit={handleSubmit}
    onSubmit={onSubmit}
    editorContent={editorContent}
    haveEditor={haveEditor}
    formUtils={formUtils}
  />
}