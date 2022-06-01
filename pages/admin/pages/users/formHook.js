// firebase
import { getAllUsers, addByCollectionType, updateUserCustomClaimsRole } from 'firebase/client'

// hooks
import { useForm } from "react-hook-form"

export const useFormHook = ({ setUsers, openUser, setRole, setOpenUser, onClose, onClose1 }) => {

  const { register, handleSubmit, formState } = useForm()
  const { errors } = formState
  const { register: register1 , handleSubmit: handleSubmit1, formState: formState1 } = useForm()

  const onSubmit = ({email, password, displayName, photoURL, role}) => {
    addByCollectionType('users', {email, password, displayName, photoURL, role}).then(() => {
      getAllUsers().then(({data}) => {
        setUsers(data)
      })
    })
    onClose()
  }

  const onSubmitUserRole = (data) => {
    console.log(data)
    updateUserCustomClaimsRole({email: openUser.email, role: data.role}, setRole)
    setOpenUser({})
    onClose1()
  }

  return {
    onSubmit,
    onSubmitUserRole,
    register,
    handleSubmit,
    formState,
    errors,
    register1,
    handleSubmit1,
    formState1
  }
  
}