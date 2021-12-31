import styled from 'styled-components'
import Image from 'next/image'
import Img from 'react-cool-img'

export const ImageWrapper = styled.div`
  max-height: 300px;
  position: relative;
  margin: 20px;
`

export const ImageStyled = styled(Img)`
  object-fit: contain;
  max-height: 300px;
  width: 100%;
`
