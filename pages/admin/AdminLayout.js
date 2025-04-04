// React / Next
import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

// Firebase functions
import { getCollections } from '@/firebase/client'

// Styled
import * as S from './styles'

// Pages
import Home from './pages/home'
import UserPage from './pages/user/user'
import CreateDoc from './pages/createDoc/createDoc'
import EditDoc from './pages/editDoc/editDoc'
import CreateCollection from './pages/createCollection/createCollection'
import DocsInCollection from './pages/docsInCollection/docsInCollection'
import Collections from './pages/collections/collections'
import EditCollection from './pages/editCollection/editCollection'
import UsersPage from './pages/users/users'

// custom admin pages
// import StoreAdminPage from '../customAdminPages/store'
import StoreAdminPage from '@/admin/customAdminPages/ecommerce'

// Components
import MediaLibrary from './pages/mediaLibrary/mediaLibrary'
import Sidebar from '@/admin/components/sidebar'
import { Box, Flex } from '@chakra-ui/react'

// State
import useStore from './store/store'

// Areas
const areas = {
  layout: `
    sidebar content 
  `,
  content: `
    contentHeader  
    contentData  
    `
}

// Layout Component
export default function AdminLayout () {
  const toggleCollectionsPanel = useStore(state => state.toggleCollectionsPanel)
  const setCollections = useStore(state => state.setCollections)

  useEffect(() => {
    getCollections().then(collections => {
      setCollections(collections[0])
    })
  }, [])

  return (
    <Router>
      <S.Layout bg='background'>
        <S.Sidebar>
          <Sidebar />
        </S.Sidebar>
        <S.ContentLayout>
          <AdminRoutes />
        </S.ContentLayout>
      </S.Layout>
      {/* <S.Layout
        areas={areas.layout}
        templateCols={`${toggleCollectionsPanel ? 'auto' : 'auto'} 1fr`}
        templateRows='1fr'
      >
        {Areas => (
          <>
            <Areas.Sidebar
              style={{
                display: 'flex'
              }}
            >
              <Sidebar />
            </Areas.Sidebar>

            <Areas.Content>
              <S.ContentDataLayout>
                <AdminRoutes />
              </S.ContentDataLayout>
            </Areas.Content>
          </>
        )}
      </S.Layout> */}
    </Router>
  )
}

const AdminRoutes = () => (
  <Switch>
    <Route path='/admin/page/store'>
      <StoreAdminPage />
    </Route>
    <Route path='/admin/users'>
      <UsersPage />
    </Route>
    <Route path='/admin/media-library'>
      <MediaLibrary />
    </Route>
    <Route path='/admin/user-profile'>
      <UserPage />
    </Route>
    <Route path='/admin/collections/create'>
      <CreateCollection />
    </Route>
    <Route path='/admin/collections'>
      <Collections />
    </Route>
    <Route path='/admin/collection/:type'>
      <EditCollection />
    </Route>
    <Route path='/admin/:type/create'>
      <CreateDoc />
    </Route>
    <Route path='/admin/:type/:id'>
      <EditDoc />
    </Route>
    <Route path='/admin/:type'>
      <DocsInCollection />
    </Route>
    <Route path='/admin'>
      <Home />
    </Route>
  </Switch>
)
