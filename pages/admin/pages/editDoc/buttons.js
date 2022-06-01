import PreviewDrawer from '@/admin/atoms/previewDrawer'
import UpdateButton from '@/admin/atoms/UpdateButton'

export const Button = ({
  preview,
  previewSubmit,
  content
}) => {
    return (
      content && preview ? (
        <PreviewDrawer
          onClick={previewSubmit}
          content={content}
        />
      ) : 
      null
    )
}

export const Button2 = ({
  type
}) => {
  return <UpdateButton type={type} />
}