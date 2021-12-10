import React from 'react'
import { SidebarExternalLinkStyled } from './styles'
import useStore from '@/admin/store/store'

const SidebarExternalLink = ({ children, menu, ...props }) => {
  const selectedSidebarMenu = useStore(state => state.selectedSidebarMenu)

  return (
    <SidebarExternalLinkStyled
      active={menu === selectedSidebarMenu ? 1 : 0}
      {...props}
    >
      {children}
    </SidebarExternalLinkStyled>
  )
}

export default SidebarExternalLink
