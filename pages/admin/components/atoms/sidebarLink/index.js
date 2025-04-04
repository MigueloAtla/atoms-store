import React from 'react'

// styles
import { SidebarLinkStyled } from './styles'

// state
import useStore from '@/admin/store/store'
import useStoreRole from '@/store/store'

// config
import sidebarconfig from '@/admin/sidebarconfig.json'

const SidebarLink = ({ children, menu, ...props }) => {
  // uncomment THIS
  // const role = useStoreRole(state => state.role)
  const role = 'admin'
  const { selectedMenuName } = useStore(state => state)

  return (
    <SidebarLinkStyled text={sidebarconfig[role].display.text} active={menu === selectedMenuName ? 1 : 0} {...props}>
      {children}
    </SidebarLinkStyled>
  )
}

export default SidebarLink
