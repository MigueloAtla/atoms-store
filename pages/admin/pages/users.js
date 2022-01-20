import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import { useUser } from '@/hooks/useUser'

import styled from 'styled-components'

import { makeAdmin, getAllUsers } from 'firebase/client'

const UsersPage = () => {
  const { user, admin } = useUser()
	const [ users, setUsers ] = useState(null)

	useEffect(() => {
    getAllUsers().then(({data}) => {
      console.log(data)
      setUsers(data)
    })
  }, [])

  return (
    <div>
      <h2>Users</h2>
      {users?.length > 0 && users.map((user, i) => {
        return (
          <div key={i}>
            <p>{user.email}</p>
          </div>
        )
      })}
    </div>
  )
}

export default UsersPage

const IconLink = styled.a`
  width: 100%;
  height: 60px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  :hover {
    background-color: #80808017;
    border-right: 1px solid black;
  }
`
