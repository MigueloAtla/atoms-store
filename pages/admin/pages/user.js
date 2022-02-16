import React, { useEffect, useState } from 'react'

// styles
import { ProfilePictureStyled } from '../styles'

// components
import { Flex, Box, Button, Input, Select } from '@chakra-ui/react'
import PageTransitionAnimation from '@/admin/atoms/pageTransitionAnimation'
import Header from '@/admin/components/header'
import NameAvatar from 'react-avatar'
import Img from 'react-cool-img'
import TextAreaImage from '@/admin/components/atoms/textAreaImage'

// hooks
import { useUser } from '@/hooks/useUser'
import useRole from '@/admin/hooks/useRole'
import { useForm, FormProvider } from "react-hook-form"
import { updateUserProfile, updateUserCustomClaimsRole } from '@/firebase/client'

export default function UserPage () {
  const { user, setUser, role, setRole } = useUser()
  const { allowed } = useRole(['admin'])
  const [edit, setEdit] = useState(false)
  const [update, setUpdate] = useState(false)

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

  useEffect(() => {
    if (user) console.log(user)
  }, [user, role])
  return (
    <>
      <Header title='User profile'>
      {!edit ? (<Button onClick={() => {
        setEdit(true)
      }}>Edit Profile</Button>) :
      ( 
        <>
          <Button onClick={() => {setEdit(false)}}>Cancel</Button>
          <Button form='user' type='submit'>Save</Button>
        </>
      )}
      </Header>

      <Box mt='80px'>
        <PageTransitionAnimation>
          {
            !edit ? (
              <Flex direction='column'>
                {user.username}
                <p>avatar</p>
                <ProfilePictureStyled>
                  {user.avatar ? (
                    <Img src={user.avatar} alt='user avatar' />
                  ) : (
                    <NameAvatar name={user.username} size={'60'} />
                  )}
                </ProfilePictureStyled>
                {user.email}
                <div>Role: {role}</div>
              </Flex>
            ) :
            (
              <Flex direction='column'>
                <FormProvider {...{ register, errors, setValue }}>

                <form id='user' onSubmit={handleSubmit(onSubmit)}>
                <label>Username</label>
                <Input
                  type='text'
                  variant='filled'
                  defaultValue={user.username}
                  {...register("displayName", {required: true && 'Username required'})}
                  />
                  {errors.username?.message}
                  <p>avatar</p>
                  <TextAreaImage
                    name={'photoURL'}
                    isRequired={false}
                    register={register}
                    errors={errors}
                  />
                  <ProfilePictureStyled>
                    {user.avatar ? (
                      <Img src={user.avatar} alt='user avatar' />
                      ) : (
                        <NameAvatar name={user.username} size={'60'} />
                        )}
                  </ProfilePictureStyled>
                  {user.email}
                  <p>Role: {role}</p>
                  {/* { allowed ? <Select defaultValue={role} {...register("role")}>
                    <option value="">Select...</option>
                    <option value="admin">admin</option>
                    <option value="editor">editor</option>
                    <option value="user">user</option>
                  </Select>
                  : <p>*No permisions to edit role</p>
                  } */}
                </form>
                <form id='role' onSubmit={handleSubmit1(onSubmitRole)}>
                  { allowed ? <Select defaultValue={role} {...register1("role")}>
                    <option value="">Select...</option>
                    <option value="admin">admin</option>
                    <option value="editor">editor</option>
                    <option value="user">user</option>
                  </Select>
                  : <p>*No permisions to edit role</p>
                  }
                  <Button form='role' type='submit'>Save</Button>
                </form>
                </FormProvider>
              </Flex>
            )
          }
        </PageTransitionAnimation>
      </Box>
    </>
  )
}
