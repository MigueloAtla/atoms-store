import styled from 'styled-components'
import { Composition } from 'atomic-layout'
// import Img from 'react-cool-img'

// Base layout styles
export const Layout = styled(Composition)`
  height: 100vh;
  max-height: 100%;
  overflow-y: hidden;
  background-color: #f6f7f9;
  transition: all .1s ease-in;
`
export const SideBar = styled(Composition)`
  background-color: #11101d;
  box-shadow: 3px 0px 3px rgb(0 0 0 / 5%);
`
export const DataLayout = styled(Layout)`
  width: 100%;
`
export const ContentHeaderLayout = styled(Composition)`
  width: 100%;
`
export const ContentDataLayout = styled(Composition)`
  overflow-y: scroll;
  display: block !important;
  height: 100vh;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #e2e8f0;
  }
`
// Styles

export const ContentStyled = styled(Composition)`
  height: 100%;
`
export const Label = styled.label`
  width: 100%;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 10px;
  font-size: 18px;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 20px;
`
// export const ProfilePictureStyled = styled(Img)`
//   border-radius: 50%;
//   width: 40px;
//   height: 40px;
//   overflow: hidden;
//   border: 2px solid black;
// `
export const ProfilePictureStyled = styled.figure`
  width: 36px;
  height: 36px;
  margin: 0;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  transition: border-radius .2s ease-in-out;
  cursor: pointer;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: 0;
  }
`
// export const TextareaImage = styled.textarea`
//   border:
// `
