import styled from 'styled-components'

export const CollectionsListItem = styled.div`
  padding: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  height: 50px;
  cursor: pointer;
  background-color: ${props => (props.active ? '#EDEDED' : 'transparent')};
  border-right: ${props => (props.active ? '4px solid #FFFFFF' : 0)};
  transition: all 0.1s linear;
  color: ${props => (props.active ? '#282828' : '#FFFFFF')};
  font-weight: ${props => (props.active ? 'bold' : 'regular')};
  text-transform: capitalize;
  :hover {
    color: ${props => (props.active ? '#282828' : 'white')};
    background-color: ${props => (props.active ? '#EDEDED' : '#80808017')};
  }
`
