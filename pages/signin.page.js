import React, { useEffect } from 'react'
import { useUser } from '@/hooks/useUser'
import { useState } from 'react'

import { useRouter } from 'next/router'

import { signInWithEmailAndPassword } from 'firebase/client'

const SignIn = () => {
  const { user } = useUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user])

  const handeSignInSubmit = e => {
    e.preventDefault()
    signInWithEmailAndPassword(email, password)
  }

  return (
    <div>
      <h1>Sign in</h1>
      {!user && (
        <form onSubmit={handeSignInSubmit}>
          <label>Sign In</label>
          <input
            type='email'
            value={email}
            onChange={e => {
              setEmail(e.target.value)
            }}
          />
          <input
            type='password'
            value={password}
            onChange={e => {
              setPassword(e.target.value)
            }}
          />
          <button type='submit'>Sign In</button>
        </form>
      )}
    </div>
  )
}

export default SignIn
