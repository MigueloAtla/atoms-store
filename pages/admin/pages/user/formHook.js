// firebase
import { updateUserProfile, updateUserCustomClaimsRole } from '@/firebase/client'

// hooks
import { useForm } from "react-hook-form"

export const useFormHook = ({ setUser, setRole, user }) => {
  const { register, handleSubmit, formState, setValue } = useForm()
  const { errors } = formState
  const { register: register1, handleSubmit: handleSubmit1, formState: formState1, setValue1 } = useForm()
  const { errors: errors1 } = formState1

  const onSubmit = (data) => {
    console.log(data)
    updateUserProfile(user.email, data, setUser, setRole)
  }
  const onSubmitRole = (data) => {
    console.log('role form')
    console.log(data)
    updateUserCustomClaimsRole({email: user.email, role: data.role}, setRole)
    // updateUserProfile(user.email, data, setUser, setRole)
  }
  
  return {
    register,
    handleSubmit,
    formState,
    setValue,
    errors,
    register1,
    handleSubmit1,
    formState1,
    setValue1,
    errors1,
    onSubmit,
    onSubmitRole
  }
}