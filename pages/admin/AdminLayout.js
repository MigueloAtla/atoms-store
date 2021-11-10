// React / Next
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Icon, Flex } from '@chakra-ui/react'
import { FaHome, FaPlug, FaLayerGroup, FaUsers } from 'react-icons/fa'
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
import { AddIcon } from '@chakra-ui/icons'
import SidebarLink from '@/admin/atoms/sidebarLink'
import { FaImages } from 'react-icons/fa'
import { Box, Tooltip } from '@chakra-ui/react'
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
  const setSelectedSidebarMenu = useStore(state => state.setSelectedSidebarMenu)
  const setCollections = useStore(state => state.setCollections)
  const setSelectedCollectionName = useStore(
    state => state.setSelectedCollectionName
  )

  const [toggleCollectionsPanel, setToggleCollectionsPanel] = useState(false)
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
        templateCols={`${toggleCollectionsPanel ? '200px' : '90px'} 1fr`}
        templateColsXsDown='80px 1fr'
        templateRows='1fr'
      >
        {Areas => (
          <>
            <Areas.Sidebar
              style={{
                display: 'flex'
              }}
            >
              <S.SideBar
                areas={areas.sidebar}
                templateCols='1fr'
                templateRows='200px 1fr 120px'
                height='100%'
                style={{
                  width: '90px'
                }}
              >
                {Areas => (
                  <>
                    <Areas.Header
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        paddingTop: 10
                      }}
                    >
                      {/* home */}
                      <SidebarLink
                        to={`/admin`}
                        menu='home'
                        onClick={() => {
                          setSelectedCollectionName('')
                          setSelectedSidebarMenu('home')
                        }}
                      >
                        <Icon as={FaHome} width='6' height='6' color='white' />
                      </SidebarLink>

                      {/* web */}
                      <SidebarLink target='_blank' href='/'>
                        <Flex h='30px'>
                          <p style={{ color: 'white', fontWeight: 'bold' }}>
                            web
                          </p>
                        </Flex>
                      </SidebarLink>

                      {/* firebase */}
                      <SidebarLink
                        target='_blank'
                        rel='noreferrer'
                        href={`${process.env.NEXT_PUBLIC_FIREBASE_URL}`}
                      >
                        <Image src={firebase} width='20' height='20' />
                      </SidebarLink>
                    </Areas.Header>
                    <Areas.Content
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10
                      }}
                    >
                      {/* <CollectionsList /> */}
                      <SidebarLink
                        menu='collections'
                        onClick={() => {
                          setSelectedCollectionName('')
                          setSelectedSidebarMenu('collections')
                          setToggleCollectionsPanel(s => !s)
                        }}
                      >
                        <Icon as={FaLayerGroup} color='white' />
                      </SidebarLink>
                      <SidebarLink
                        to={`/admin/collections`}
                        menu='collectionslist'
                        onClick={() => {
                          setSelectedCollectionName('')
                          setSelectedSidebarMenu('collectionslist')
                        }}
                      >
                        <AddIcon />
                      </SidebarLink>
                      <SidebarLink
                        to='/admin/media-library'
                        menu='medialibrary'
                        onClick={() => {
                          setSelectedCollectionName('')
                          setSelectedSidebarMenu('medialibrary')
                        }}
                      >
                        <Icon as={FaImages} color='white' />
                      </SidebarLink>
                      <SidebarLink
                        to={`/admin/users`}
                        menu='users'
                        onClick={() => {
                          setSelectedCollectionName('')
                          setSelectedSidebarMenu('users')
                        }}
                      >
                        <Icon as={FaUsers} color='white' />
                      </SidebarLink>
                      <SidebarLink
                        to={`/admin/plugins`}
                        menu='plugins'
                        onClick={() => {
                          setSelectedCollectionName('')
                          setSelectedSidebarMenu('plugins')
                        }}
                      >
                        <Icon as={FaPlug} color='white' />
                      </SidebarLink>
                    </Areas.Content>
                    <Areas.Footer
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10
                      }}
                    >
                      <SidebarLink
                        to='/admin/user-profile'
                        menu='profile'
                        onClick={() => {
                          setSelectedCollectionName('')
                          setSelectedSidebarMenu('profile')
                        }}
                      >
                        <User />
                      </SidebarLink>
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
              {toggleCollectionsPanel && (
                <Flex
                  height='100%'
                  width='calc(100% - 90px)'
                  style={{
                    backgroundColor: 'black',
                    borderLeft: '1px solid white'
                  }}
                >
                  <CollectionsList />
                </Flex>
              )}
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

// const IconLink = styled.a`
//   width: 100%;
//   height: 60px;
//   cursor: pointer;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   :hover {
//     background-color: #80808017;
//     border-right: 1px solid black;
//   }
// `

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
