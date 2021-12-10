import styled from 'styled-components'

export const SidebarButtonStyled = styled.div`
  border-radius: 12px;
  width: 60px;
  height: 60px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: ${({ active }) => (active ? '#c2c2c2' : 'transparent')};
  :hover {
    background-color: #80808017;
    border-right: 1px solid black;
  }
`
