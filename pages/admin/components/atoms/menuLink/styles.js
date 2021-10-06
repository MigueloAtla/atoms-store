import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const IconLink = styled(Link)`
  width: 100%;
  height: 60px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  :hover {
    background-color: #80808017;
    border-right: 1px solid black;
  }
`
