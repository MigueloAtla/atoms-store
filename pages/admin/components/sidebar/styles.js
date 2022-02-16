import styled from 'styled-components'
import { Composition } from 'atomic-layout'

export const SidebarStyled = styled(Composition)`
  background-color: #11101d;
  box-shadow: 3px 0px 3px rgb(0 0 0 / 5%);
  padding: 8px;
`

export const Settings = styled.div`
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