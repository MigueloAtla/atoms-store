import React from 'react'
import { useUser } from '@/hooks/useUser'
import { ProfilePictureStyled } from '../../styles'
import { ProfilePictureWrapperStyled } from './styles'

export default function User () {
  const { user } = useUser()
  return (
    <>
      {user && user.avatar && (
        <ProfilePictureWrapperStyled>
          <ProfilePictureStyled
            src={user.avatar}
            width='35'
            height='35'
            alt='profile picture'
          />
        </ProfilePictureWrapperStyled>
      )}
    </>
  )
}
