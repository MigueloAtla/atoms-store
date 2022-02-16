import React, { useEffect, useState } from 'react'

// config
import sidebarconfig from '@/admin/sidebarconfig.json'

// styles
import { SidebarStyled, Settings } from './styles'

// components
import { Icon, Flex } from '@chakra-ui/react'
import User from '@/admin/components/userLink'
import CollectionsList from '@/admin/components/collectionsList'
import SidebarButton from '@/admin/atoms/sidebarButton'
import SidebarLink from '@/admin/atoms/sidebarLink'
import SidebarExternalLink from '@/admin/atoms/sidebarExternalLink'

// icons
import { FaHome, FaPlug, FaLayerGroup, FaUsers , FaImages, FaShoppingBag, FaChartBar } from 'react-icons/fa'
import { AddIcon, SettingsIcon } from '@chakra-ui/icons'

// state
import useStore from '@/admin/store/store'
import useStoreRole from '@/store/store'

const areas = {
  sidebar: `
    header  
    content
    footer  
  `
}

const Icons = {
  FaHome,
  FaImages,
  FaPlug,
  FaLayerGroup,
  FaUsers,
  AddIcon,
  SettingsIcon,
  FaShoppingBag,
  FaChartBar
}

const Sidebar = () => {
  const role = useStoreRole(state => state.role)
  const setSelectedSidebarMenu = useStore(state => state.setSelectedSidebarMenu)
  const toggleCollectionsPanel = useStore(state => state.toggleCollectionsPanel)
  const setToggleCollectionsPanel = useStore(
    state => state.setToggleCollectionsPanel
  )
  const setSelectedCollectionName = useStore(
    state => state.setSelectedCollectionName
  )
      
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)

  return (
    <>
      <SidebarStyled
        areas={areas.sidebar}
        templateCols='1fr'
        templateRows='200px 1fr 120px'
        height='100%'
        // style={{
        //   width: '90px'
        // }}
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
              {
                <>
                  {/* home */}
                  {
                    sidebarconfig[role].home && (
                      <SidebarLink
                        to={`/admin`}
                        menu='home'
                        onClick={() => {
                          setSelectedCollectionName('')
                          setSelectedSidebarMenu('home')
                        }}
                      >
                        {
                          sidebarconfig[role].display.icons &&
                          <Icon as={FaHome} width='6' height='6' color='white' />
                        }
                        {
                          sidebarconfig[role].display.text &&
                          <p>Home</p>
                        }
                      </SidebarLink>
                    )
                  }

                  {/* web */}
                  <SidebarExternalLink target='_blank' href='/'>
                    <Flex h='30px'>
                      <p style={{ color: 'white', fontWeight: 'bold' }}>
                        web
                      </p>
                    </Flex>
                  </SidebarExternalLink>

                  {/* firebase */}
                  {
                    sidebarconfig[role].firebase && (
                      <SidebarExternalLink
                        target='_blank'
                        rel='noreferrer'
                        href={`${process.env.NEXT_PUBLIC_FIREBASE_URL}`}
                      >
                        <p style={{ color: 'white', fontWeight: 'bold' }}>
                          firebase
                        </p>
                        {/* <Image src={firebase} width='20' height='20' /> */}
                      </SidebarExternalLink>
                    )
                  }
                  
                </>
              }
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
              <Flex flexDirection='column' gap='10px'>
                {
                  Object.keys(sidebarconfig[role].menu).map((item, i) => {
                    let { type, route = '', menu, icon } = sidebarconfig[role].menu[item]
                    let Icon = Icons[icon]
                    return (
                      type === 'link' ? (
                        <SidebarLink
                          key={route + i}
                          to={route}
                          menu={menu}
                          onClick={() => {
                            setSelectedCollectionName('')
                            setSelectedSidebarMenu(menu)
                          }}
                        >
                            {
                              sidebarconfig[role].display.icons &&
                              <Icon />
                            }
                            {
                              sidebarconfig[role].display.text &&
                              <p>{menu}</p>
                            }
                        </SidebarLink>
                      )
                      : type === 'drawer' && (
                        <SidebarButton
                          menu={menu}
                          key={menu + i}
                          onClick={() => {
                            setToggleCollectionsPanel(!toggleCollectionsPanel)
                          }}
                        >
                          <Icon />
                        </SidebarButton>
                      )
                    )
                  })
                }
              </Flex>
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
              {
                sidebarconfig[role].userprofile && (
                  <SidebarLink
                    to='/admin/user-profile'
                    menu='profile'
                    onClick={() => {
                      setSelectedCollectionName('')
                      setSelectedSidebarMenu('profile')
                    }}
                  >
                    {
                      sidebarconfig[role].display.icons &&
                      <User />
                    }
                    {
                      sidebarconfig[role].display.text &&
                      <p>Chev</p>
                    }
                    
                  </SidebarLink>
                )
              }
              {
                sidebarconfig[role].settings && (
                  <Settings>
                    <Flex>
                      {
                        sidebarconfig[role].display.icons &&
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
                      }
                      {
                        sidebarconfig[role].display.text &&
                        <p>Settings</p>
                      }
                    </Flex>
                  </Settings>
                )
              }
            </Areas.Footer>
          </>
        )}
      </SidebarStyled>
      {toggleCollectionsPanel && (
        <Flex
          height='100%'
          style={{
            backgroundColor: 'black',
            borderLeft: '1px solid white'
          }}
        >
          <CollectionsList />
        </Flex>
      )}
    </>
  )
}

export default Sidebar