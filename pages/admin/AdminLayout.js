// React / Next
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Icon, Flex } from '@chakra-ui/react'
import { FaHome } from 'react-icons/fa'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

// Firebase functions
import { getCollections } from '@/firebase/client'

// Styled
import * as S from './styles'

// Components
import CollectionsList from './components/collectionsList'
import Edit from './pages/edit'
import Create from './pages/create'
import Home from './pages/home'
import NewCollection from './pages/newCollection'
import Collections from './pages/collections'
import CollectionSchema from './pages/collectionSchema'
import UserPage from './pages/user'
import User from '@/admin/components/userLink'
import CollectionList from './pages/collectionList'
import MediaLibrary from './pages/mediaLibrary'

// Assets
import firebase from '../../public/firebase.svg'

// State
import useStore from './store/store'
import { SettingsIcon } from '@chakra-ui/icons'
import styled from 'styled-components'

// Areas
const areas = {
  layout: `
    sidebar content 
  `,
  sidebar: `
    header  
    content
    footer  
  `,
  content: `
    contentHeader  
    contentData  
    `
}

// Layout Component
export default function AdminLayout () {
  const setCollections = useStore(state => state.setCollections)
  const setSelectedCollectionName = useStore(
    state => state.setSelectedCollectionName
  )

  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)

  useEffect(() => {
    getCollections().then(collections => {
      setCollections(collections[0])
    })
  }, [])

  return (
    <Router>
      <S.Layout
        areas={areas.layout}
        templateCols='90px 1fr'
        templateColsXsDown='80px 1fr'
        templateRows='1fr'
      >
        {Areas => (
          <>
            <Areas.Sidebar>
              <S.SideBar
                areas={areas.sidebar}
                templateCols='1fr'
                templateRows='200px 1fr 120px'
                height='100%'
              >
                {Areas => (
                  <>
                    <Areas.Header>
                      <a target='_blank' href='/'>
                        <Flex h='30px'>
                          <p style={{ color: 'white' }}>Go to web</p>
                        </Flex>
                      </a>
                      <Link
                        to='/admin'
                        onClick={() => {
                          setSelectedCollectionName('')
                        }}
                      >
                        <Flex>
                          <Icon as={FaHome} color='white' />
                          <p style={{ color: 'white' }}>home</p>
                        </Flex>
                      </Link>
                      <IconLink
                        target='_blank'
                        rel='noreferrer'
                        href={`${process.env.NEXT_PUBLIC_FIREBASE_URL}`}
                      >
                        <Image src={firebase} width='20' height='20' />
                      </IconLink>
                    </Areas.Header>
                    <Areas.Content>
                      <CollectionsList />
                    </Areas.Content>
                    <Areas.Footer>
                      <Link
                        to='/admin/user-profile'
                        onClick={() => {
                          setSelectedCollectionName('')
                        }}
                      >
                        <User />
                      </Link>
                      <Settings>
                        <SettingsIcon
                          w='30'
                          h='30'
                          onMouseDown={() => {
                            setRotate(45)
                            setScale(0.9)
                          }}
                          onMouseUp={() => {
                            setRotate(0)
                            setScale(1)
                          }}
                          style={{
                            transition: 'transform 0.1s ease-out',
                            transform: `rotateZ(${rotate}deg) scale(${scale})`
                          }}
                        />
                      </Settings>
                    </Areas.Footer>
                  </>
                )}
              </S.SideBar>
            </Areas.Sidebar>

            <Areas.Content>
              <S.ContentDataLayout>
                <AdminRoutes />
              </S.ContentDataLayout>
            </Areas.Content>
          </>
        )}
      </S.Layout>
    </Router>
  )
}

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

const Settings = styled.div`
  width: 100%;
  height: 60px;
  cursor: pointer;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: #80808017;
    border-right: 1px solid black;
  }
`

const AdminRoutes = () => (
  <Switch>
    <Route path='/admin/media-library'>
      <MediaLibrary />
    </Route>
    <Route path='/admin/user-profile'>
      <UserPage />
    </Route>
    <Route path='/admin/new-collection'>
      <NewCollection />
    </Route>
    <Route path='/admin/collections'>
      <Collections />
    </Route>
    <Route path='/admin/collection/:type'>
      <CollectionSchema />
    </Route>
    <Route path='/admin/:type/create'>
      <Create />
    </Route>
    <Route path='/admin/:type/:id'>
      <Edit />
    </Route>
    <Route path='/admin/:type'>
      <CollectionList />
    </Route>
    <Route path='/admin'>
      <Home />
    </Route>
  </Switch>
)
