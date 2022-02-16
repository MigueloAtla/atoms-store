import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const SidebarLinkStyled = styled(Link)`
  border-radius: 12px;
  width: ${({text}) => text ? '100%': '60px'};
  height: 60px;
  cursor: pointer;
  display: flex;
  justify-content: ${({text}) => text ? 'flex-start': 'center'};
  align-items: center;
  color: white;
  background-color: ${({ active }) => (active ? '#c2c2c2' : 'transparent')};
  gap: 10px;
  margin-bottom: 10px;
  :hover {
    background-color: #80808017;
  }
`
