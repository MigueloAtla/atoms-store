import styled from 'styled-components'
import Image from 'next/image'
import { capitalize } from 'utils'
import { parse } from 'node-html-parser'

import css from '@styled-system/css'
import { Heading, Paragraph } from '@/atoms'
import { Box } from 'rebass/styled-components'

// Theme
export const theme = {
  breakpoints: ['40em', '52em', '64em'],
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64],
  colors: {
    blue: '#07c',
    lightgray: '#f6f6ff',
    bgPrimary: '#fff',
    dark: '#000',
    light: '#fff'
  },
  space: [0, 4, 8, 16, 32, 64, 128, 256],
  fonts: {
    body: 'system-ui, sans-serif',
    heading: 'inherit',
    monospace: 'Menlo, monospace'
  },
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700
  },
  lineHeights: {
    body: 1.5,
    heading: 1.25
  },
  shadows: {
    small: '0 0 4px rgba(0, 0, 0, .125)',
    large: '0 0 24px rgba(0, 0, 0, .125)'
  },
  variants: {},
  text: {},
  buttons: {
    primary: {
      color: 'white',
      bg: 'primary'
    }
  }
}

// export default theme

export const PostWrapperStyled = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${props => props.theme.colors.bgPrimary};
`

export const TitleStyled = ({ as, style = {}, ...props }) => (
  <Heading
    as={as}
    css={css({
      ...style
    })}
    {...props}
  />
)

export const LongTextStyled = ({ ...props }) => (
  <Paragraph
    css={css({
      color: 'tomato'
    })}
    {...props}
  />
)

export const ImageWrapper = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
  margin: 20px;
`
export const ImageStyled = styled(Image)`
  object-fit: contain;
`
export const ContentStyled = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  h1 {
    font-size: 48px;
  }

  img {
    max-width: 100%;
    align-self: center;
  }
`

const components = {
  title: TitleStyled,
  description: LongTextStyled,
  image: ImageStyled,
  content: ContentStyled
}

export const withTheme = doc => {
  const response = {}
  for (let [key, value] of Object.entries(doc)) {
    if (key !== 'id' && key !== 'createdAt') {
      let Comp = components[key]

      // Richt text mapping
      if (value.type === 'richtext') {
        let contentMarkup = []
        const root = parse(value.value)
        root.childNodes.map(node => {
          switch (node.rawTagName) {
            case 'p':
              if (node.innerText !== '') {
                contentMarkup.push(() => (
                  <LongTextStyled>{node.innerText}</LongTextStyled>
                ))
              }
              break
            case 'img':
              contentMarkup.push(() => (
                <img
                  src={node.attributes.src}
                  alt='content image'
                  width='100%'
                />
              ))
              break
            case 'h1':
              contentMarkup.push(() => (
                <TitleStyled>{node.innerText}</TitleStyled>
              ))
              break
          }
        })

        response[capitalize(key)] = () => {
          return contentMarkup.map((Comp, i) => {
            return <Comp key={i} />
          })
        }
      } else if (value.type === 'image') {
        response[capitalize(key)] = () => (
          <ImageWrapper>
            <ImageStyled
              src={value.value}
              alt={doc.title.value}
              layout='fill'
            />
          </ImageWrapper>
        )
      } else
        response[capitalize(key)] = props => (
          <Comp {...props}>{value.value}</Comp>
        )
    }
  }
  return response
}
