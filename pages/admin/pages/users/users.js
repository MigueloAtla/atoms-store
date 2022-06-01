// components
import Table from '@/admin/components/table'
import * as Buttons from './buttons'

import { Box } from '@chakra-ui/react'

// HOC
import withPageHoc from '../pageHoc'

// hooks
import { useInitialHook } from './initialHook'
import { useFormHook } from './formHook'

import { CreateUserModal } from '@/admin/components/createUserModal'
import { UserModal } from '@/admin/components/userModal'

const UsersPage = ({
  users,
  openUser,
  setOpenUser,
  columns,
  data,
  onSubmit,
  onSubmitUserRole,
  register,
  handleSubmit,
  errors,
  register1,
  handleSubmit1,
  isOpen,
  onClose,
  isOpen1,
  onOpen1,
  onClose1
}) => {

  return (
    <>
      <Box mt='80px'>
        {users?.length > 0 && <Table data={data} columns={columns} clickRowData='row' onClick={(values) => {
          setOpenUser(values)
          onOpen1()
        }} />}
      </Box>

      {/* Modal for sign in */}
      <CreateUserModal 
        register={register}
        onClose={onClose} 
        isOpen={isOpen} 
        onSubmit={handleSubmit(onSubmit)}
        errors={errors}
      />

      {/* Modal for user role */}
      <UserModal
        onClose={() => {
          setOpenUser({})
          onClose1()
        }} 
        isOpen={isOpen1}
        openUser={openUser}
        onSubmit={handleSubmit1(onSubmitUserRole)}
        register={register1}
      />
    </>
  )
}

export default withPageHoc({
  controller: useInitialHook,
  form: {
    hook: useFormHook,
  },
  header: {
    back: false,
    title: 'Users'
  },
  buttons: Buttons,
  events: {
    load: 'users',
    created: {
      msg: 'User created successfully',
      description: 'Alright!'
    }
  },
  allowed_roles: ['admin', 'editor']
})(UsersPage)