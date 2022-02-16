import React from 'react'

// components
import NameAvatar from 'react-avatar'
import Img from 'react-cool-img'

// hooks
import { useUser } from '@/hooks/useUser'

// styles
import { ProfilePictureStyled } from '../../styles'
// import { ProfilePictureWrapperStyled } from './styles'

export default function User () {
  const { user } = useUser()
  return (
    <>
      <ProfilePictureStyled>
        {user.avatar ? (
          <Img src={user.avatar} alt='user avatar' />
        ) : (
          <NameAvatar name={user.username} size={'50'} />
        )}
      </ProfilePictureStyled>
    </>
  )
}
