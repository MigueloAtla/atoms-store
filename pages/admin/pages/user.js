import React, { useEffect } from 'react'
import { useUser } from '@/hooks/useUser'
import { Flex } from '@chakra-ui/layout'
import { ProfilePictureStyled } from '../styles'
import PageTransitionAnimation from '@/admin/atoms/pageTransitionAnimation'

export default function UserPage () {
  const [user, admin] = useUser()
  useEffect(() => {
    if (user) console.log(user.username)
  }, [user])
  return (
    <PageTransitionAnimation>
      User Page
      {user && (
        <Flex direction='column'>
          {user.username}
          <ProfilePictureStyled
            src={user.avatar}
            width='120'
            height='120'
            layout='fixed'
          />
          {user.email}
          <div>Role: {admin ? 'admin' : 'personita normal'}</div>
        </Flex>
      )}
    </PageTransitionAnimation>
  )
}
