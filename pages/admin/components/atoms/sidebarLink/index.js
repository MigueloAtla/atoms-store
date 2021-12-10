import React from 'react'
import { SidebarLinkStyled } from './styles'
import useStore from '@/admin/store/store'

const SidebarLink = ({ children, menu, ...props }) => {
  const selectedSidebarMenu = useStore(state => state.selectedSidebarMenu)

  return (
    <SidebarLinkStyled active={menu === selectedSidebarMenu ? 1 : 0} {...props}>
      {children}
    </SidebarLinkStyled>
  )
}

export default SidebarLink
