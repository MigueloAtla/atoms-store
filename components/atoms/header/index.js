import React from 'react'
import Link from 'next/link'

import { signOut } from 'firebase/client'

import { useUser } from '@/hooks/useUser'

import styled from 'styled-components'

const Header = () => {
  const { user, setUser } = useUser()
  return (
    <HeaderStyled>
      {user ? (
        <button
          onClick={() => {
            signOut()
              .then(() => {
                // Sign-out successful.
                console.log('logout')
                setUser(null)
              })
              .catch(error => {
                console.log(error)
                // An error happened.
              })
          }}
        >
          logout
        </button>
      ) : (
        <div>
          <Link href='/login'>Login</Link>
          <Link href='/signin'>Signin</Link>
        </div>
      )}
    </HeaderStyled>
  )
}

export default Header

const HeaderStyled = styled.header`
  background-color: black;
  height: 40px;
`
