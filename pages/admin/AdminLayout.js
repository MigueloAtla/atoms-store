// React / Next
import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

// Firebase functions
import { getCollections } from '@/firebase/client'

// Styled
import * as S from './styles'

// Pages
import Home from './pages/home'
import UserPage from './pages/user'
import CreateDoc from './pages/createDoc'
import EditDoc from './pages/editDoc'
import CreateCollection from './pages/createCollection'
import DocsInCollection from './pages/docsInCollection'
import Collections from './pages/collections'
import EditCollection from './pages/editCollection'
import UsersPage from './pages/users'

// custom admin pages
import StoreAdminPage from '../customAdminPages/store'

// Components
import MediaLibrary from './pages/mediaLibrary'
import Sidebar from '@/admin/components/sidebar'

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
      <S.Layout
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
      </S.Layout>
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
    <Route path='/admin/new-collection'>
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
