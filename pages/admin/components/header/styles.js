import styled from 'styled-components'

export const HeaderStyled = styled.header`
  background-color: #ffffffed;
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 6px;
  height: 60px;
  width: calc(100% - 100px);
  align-items: center;
  position: fixed;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(20px);
`
