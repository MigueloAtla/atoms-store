import React from 'react'

// styles
import { ProfilePictureStyled } from '../../styles'

// components
import { Flex, Box, Button, Input, Select } from '@chakra-ui/react'
import NameAvatar from 'react-avatar'
import Img from 'react-cool-img'
import TextAreaImage from '@/admin/components/atoms/textAreaImage'
import * as Buttons from './buttons'

// hooks
import { FormProvider } from "react-hook-form"
import { useInitialHook } from './initialHook'
import { useFormHook } from './formHook'

// HOC
import withPageHoc from '../pageHoc'

const User = ({
  user,
  role,
  edit,
  allowed,
  register,
  handleSubmit,
  setValue,
  errors,
  register1,
  handleSubmit1,
  onSubmit,
  onSubmitRole
}) => {
  return (
    <>
      <Box mt='80px'>
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
      </Box>
    </>
  )
}

export default withPageHoc({
  controller: useInitialHook,
  form: {
    hook: useFormHook
  },
  header: {
    back: false,
    title: 'User profile'
  },
  buttons: Buttons,
  allowed_roles: ['admin', 'editor', 'user']
})(User)