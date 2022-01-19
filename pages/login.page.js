import React, { useEffect, useState } from 'react'
import { useUser } from '@/hooks/useUser'

import { useRouter } from 'next/router'

import { signUpWithEmailAndPassword, loginWithGithub } from 'firebase/client'

const Login = () => {
  const { user } = useUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user])

  const handeSignUpSubmit = e => {
    e.preventDefault()
    signUpWithEmailAndPassword(email, password)
      .then(user => {
        setUser(user)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const login = () => {
    loginWithGithub()
      .then(user => {
        setUser(user)
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <div>
      <h1>Login</h1>
      {!user && (
        <div>
          <button onClick={login}>Login with GitHub</button>
          <form onSubmit={handeSignUpSubmit}>
            <label>Sign up</label>
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
            <button type='submit'>Sign up</button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Login
