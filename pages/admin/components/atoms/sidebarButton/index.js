import React from 'react'
import { SidebarButtonStyled } from './styles'
import useStore from '@/admin/store/store'

const SidebarButton = ({ children, menu, ...props }) => {
  const selectedSidebarMenu = useStore(state => state.selectedSidebarMenu)

  return (
    <SidebarButtonStyled
      active={menu === selectedSidebarMenu ? 1 : 0}
      {...props}
    >
      {children}
    </SidebarButtonStyled>
  )
}

export default SidebarButton
