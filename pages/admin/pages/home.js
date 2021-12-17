import React from 'react'
import Link from 'next/link'
import { Icon, Flex } from '@chakra-ui/react'
// import { FaHome } from 'react-icons/fa'
// import Image from 'next/image'
import styled from 'styled-components'
// import firebase from '../../../public/firebase.svg'

const Home = () => {
  return (
    <div>
      <h2>Home</h2>
      <Link href='/'>
        <a>
          <Flex h='30px'>
            <p>Go to web</p>
          </Flex>
        </a>
      </Link>
      <IconLink
        target='_blank'
        rel='noreferrer'
        href={`${process.env.NEXT_PUBLIC_FIREBASE_URL}`}
      >
        firebase
        {/* <Image src={firebase} width='20' height='20' /> */}
      </IconLink>
    </div>
  )
}

export default Home

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
