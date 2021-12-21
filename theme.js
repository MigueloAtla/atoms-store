import styled, { createGlobalStyle, css } from 'styled-components'
import { LayoutStyled } from '@/layouts/index'
import Image from 'next/image'
import Img from 'react-cool-img'

import { capitalize } from '@/utils'
// import { parse } from 'node-html-parser'

import { Heading, ImageWrapper, ImageStyled } from '@/atoms'
import { Text } from 'rebass/styled-components'

// Theme
export const theme = {
  breakpoints: ['40em', '52em', '64em'],
  fontSizes: ['12px', '14px', '16px', '20px', '24px', '32px', '48px', '64px'],
  colors: {
    blue: '#07c',
    lightgray: '#f6f6ff',
    bgPrimary: '#fff',
    bgSecondary: 'tomato',
    dark: '#1e1e1e',
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

export const TitleStyled = ({ as, style = {}, ...props }) => (
  <Heading
    as={as}
    css={css({
      ...style
    })}
    {...props}
  />
)

export const LongTextStyled = ({ ...props }) => <Text as='p' {...props} />

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

// export const withTheme = {
//   bg: 'tomato',
//   'h1, h2, h3, h4, h5, h6, p': {
//     color: 'light'
//   }
// }

export const Paragraph = styled(Text)`
  margin: 10px 0;
  line-height: 25px;
`

export const Bold = styled.b`
  font-weight: bold;
`

export const Italic = styled.i`
  font-style: italic;
`

export const WithTheme = styled.div`
  ${LayoutStyled} {
    background-color: tomato;
    h1 {
      color: white;
    }
  }
`
export const withTheme = css`
  ${LayoutStyled} {
    background-color: tomato;
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p {
      color: white;
    }
  }
`

export const GlobalStyles = createGlobalStyle`
  body {
    background-color: ${props => props.theme.colors.dark};
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p {
    color: ${props => props.theme.colors.light};
  }
  h1 {
    font-size: ${props => props.theme.fontSizes[(5, 6, 7)]};
  }
`

const components = {
  text: Text,
  longtext: LongTextStyled,
  image: ImageStyled,
  content: ContentStyled,
  bold: Bold,
  italic: Italic
}

export const getComponents = doc => {
  const response = {}
  for (let [key, value] of Object.entries(doc)) {
    if (key !== 'id' && key !== 'createdAt') {
      let Comp = components[value.type]

      // Richt text mapping

      if (value.type === 'richtext') {
        const markupContent = []
        value.value.content?.length > 0 &&
          value.value.content.map(element => {
            if (element.type !== 'image') {
              if (element.type === 'paragraph') {
                let content = []
                let type = ''
                element.content?.length > 0 &&
                  element.content.map(el => {
                    el.marks &&
                      el.marks.map(m => {
                        if (m.type !== undefined) type = m.type
                      })
                    if (type.length > 0) {
                      let Comp = components[type]
                      content.push(function ParagraphInner () {
                        return <Comp>{el.text}</Comp>
                      })
                      type = ''
                    } else {
                      content.push(function ParagraphInner () {
                        return `${el.text}`
                      })
                    }
                  })

                markupContent.push(function ParagraphOuter () {
                  return (
                    <Paragraph as='p'>
                      {content.length > 0 &&
                        content.map((Text, i) => {
                          if (
                            typeof Text === 'string' ||
                            Text instanceof String
                          )
                            return Text
                          else return <Text key={i} />
                        })}
                    </Paragraph>
                  )
                })
              }

              if (element.type === 'heading') {
                let content
                element.content.map(el => {
                  content = el.text
                })

                markupContent.push(function Heading () {
                  return <Text as={`h${element.attrs.level}`}>{content}</Text>
                })
              }
            } else {
              markupContent.push(function ImageContent () {
                return (
                  <Img
                    src={element.attrs.src}
                    alt='content'
                    style={{ width: '100%' }}
                  />
                )
              })
            }
          })
        response[capitalize(key)] = () => {
          return markupContent.map((Comp, i) => {
            return <Comp key={i} />
          })
        }
      }

      // if (value.type === 'richtext') {
      //   if (value.value !== '') {
      //     console.log(value)
      //     let contentMarkup = []
      //     const root = parse(value.value)
      //     root.childNodes.map(node => {
      //       switch (node.rawTagName) {
      //         case 'p':
      //           if (node.innerText !== '') {
      //             contentMarkup.push(() => (
      //               <LongTextStyled>{node.innerText}</LongTextStyled>
      //             ))
      //           }
      //           break
      //         case 'img':
      //           contentMarkup.push(() => (
      //             <img
      //               src={node.attributes.src}
      //               alt='content image'
      //               width='100%'
      //             />
      //           ))
      //           break
      //         case 'h1':
      //           contentMarkup.push(() => (
      //             <TitleStyled>{node.innerText}</TitleStyled>
      //           ))
      //           break
      //       }
      //     })

      //     response[capitalize(key)] = () => {
      //       return contentMarkup.map((Comp, i) => {
      //         return <Comp key={i} />
      //       })
      //     }
      //   } else response[capitalize(key)] = () => ''
      // }
      else if (value.type === 'image') {
        if (value.value !== '') {
          response[capitalize(key)] = function MappedImage () {
            return (
              <ImageWrapper>
                <ImageStyled src={value.value} alt={doc.title.value} />
              </ImageWrapper>
            )
          }
        } else response[capitalize(key)] = () => ''
      } else {
        response[capitalize(key)] = function MappedComp (props) {
          return <Comp {...props}>{value.value}</Comp>
        }
      }
    }
  }
  return response
}
