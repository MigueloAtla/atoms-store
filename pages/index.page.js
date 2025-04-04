import Head from 'next/head'
import Img from 'react-cool-img'

import { makeAdmin } from 'firebase/client'
import { useState } from 'react'
import { useUser } from '@/hooks/useUser'

export default function Home () {
  const { user, admin } = useUser()
  const [ users, setUsers ] = useState(null)
  const [ email, setEmail ] = useState('')

  // const login = () => {
  //   loginWithGithub()
  //     .then(user => {
  //       setUser(user)
  //     })
  //     .catch(err => {
  //       console.log(err)
  //     })
  // }

  const handeAdminSubmit = e => {
    e.preventDefault()
    makeAdmin(email)
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <h1>start page: ATOMS CMS</h1>
        <h2>Hi {}</h2>
        {user === null ? (
          // <button onClick={login}>Login with GitHub</button>
          <p>no user</p>
        ) : (
          <div>
            {admin ? <h1>Admin!!!!</h1> : <h1>No admin</h1>}
            {user.username}
            {user.email}
            <Img src={user.avatar} alt='avatar' width='125' height='125' />
          </div>
        )}
      </main>

      <form onSubmit={handeAdminSubmit}>
        <label>Create admin</label>
        <input
          type='text'
          value={email}
          onChange={e => {
            setEmail(e.target.value)
          }}
        />
        <button type='submit'>Make admin</button>
      </form>

      {/* <button
        onClick={() => {
          isAdmin(setAdmin)
          console.log(admin)
        }}
      >
        Is admin?
      </button> */}
    </>
  )
}
