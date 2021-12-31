import styled, { createGlobalStyle, css } from 'styled-components'
import { LayoutStyled } from '@/layouts/index'
import Img from 'react-cool-img'
import { capitalize } from '@/utils'
import { Heading, ImageWrapper, ImageStyled } from '@/atoms'
import { Text } from 'styled-bento'
import React from 'react'

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
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: regular;
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
    font-family: ${props => props.theme.fonts.body}
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p {
    color: ${props => props.theme.colors.light};
    font-weight: 400;
  }
  
  h1 {
    font-size: ${props => props.theme.fontSizes[7]};
    color: tomato;
  }
  h2 {
    font-size: ${props => props.theme.fontSizes[6]};
  }
`

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

export const HorizontalRule = styled.hr`
  border-top: 1px solid white;
  width: 100%;
`
export const Ul = styled.ul`
  color: white;
  margin-left: 20px;
`
export const Ol = styled.ol`
  color: white;
  margin-left: 20px;
`
export const Blockquote = styled.blockquote`
  color: white;
  border-left: 1px solid white;
  background-color: #ffffff22;
`

export const Strike = styled.s``

const H1 = ({ children, props }) => {
  return (
    <Text {...props} as='h1' fontSize={[4, 5, 7]} fontWeight='inherit'>
      {children}
    </Text>
  )
}
const H2 = ({ children, props }) => {
  return (
    <Text {...props} as='h2' fontSize={[4, 5, 6]} fontWeight='inherit'>
      {children}
    </Text>
  )
}
const H3 = ({ children, props }) => {
  return (
    <Text
      {...props}
      as='h3'
      fontSize={['8px', '12px', '20px']}
      fontWeight='inherit'
    >
      {children}
    </Text>
  )
}
const P = ({ children, props }) => {
  return (
    <Text {...props} as='p' fontWeight='inherit'>
      {children}
    </Text>
  )
}

export const components = {
  text: Text,
  longtext: LongTextStyled,
  image: ImageStyled,
  content: ContentStyled,
  bold: Bold,
  italic: Italic,
  strike: Strike,
  h1: H1,
  h2: H2,
  h3: H3,
  contentParagraph: P,
  horizontalRule: HorizontalRule
}

const wrapMarks = markComps => {
  return markComps.reverse().reduce(
    (ComponentSoFar, { component, props }) => {
      const Outer = component
      return function Comp ({ children }) {
        return (
          <Outer>
            <ComponentSoFar>{children}</ComponentSoFar>
            {'content' in props && children}
          </Outer>
        )
      }
    },
    props => null
  )
}
const getMarks = (marks, markComps) => {
  marks.map(mark => {
    const Comp = components[mark.type]
    markComps.push({
      component: ({ children }) => <Comp>{children}</Comp>,
      props: {}
    })
  })
}

const selectComponentType = (element, markupContent, Wrapper = null) => {
  switch (element.type) {
    case 'image':
      markupContent.push(function ImageContent () {
        return (
          <Img
            src={element.attrs.src}
            alt='content'
            style={{ width: '100%' }}
          />
        )
      })
      break
    case 'paragraph':
      if (element.content !== undefined) {
        return element.content.map(el => {
          const markComps = []
          if (el.marks !== undefined) {
            getMarks(el.marks, markComps)
          }
          let type = el.type
          if (el.type === 'text') type = 'contentParagraph'
          const Comp = components[type]
          if (el.text !== undefined)
            markComps.push({
              component: ({ children }) => {
                return Wrapper ? (
                  <Wrapper>
                    <Comp>{children}</Comp>
                  </Wrapper>
                ) : (
                  <Comp>{children}</Comp>
                )
              },
              props: { content: el.text }
            })
          const Component = wrapMarks(markComps)
          markupContent.push(function TextComp () {
            return <Component>{el.text}</Component>
          })

          selectComponentType(el, markupContent)
        })
      } else {
        markupContent.push(function TextComp () {
          return (
            <p>
              <br />
            </p>
          )
        })
      }
      break
    case 'heading':
      let headingContent
      let markComps = []
      if (element.content !== undefined) {
        element.content?.map(el => {
          if (el.marks !== undefined) {
            getMarks(el.marks, markComps)
          }
          headingContent = el.text

          const Heading = components[`h${element.attrs.level}`]
          if (el.text !== undefined)
            markComps.push({
              component: ({ children }) => {
                return Wrapper ? (
                  <Wrapper>
                    <Heading>{children}</Heading>
                  </Wrapper>
                ) : (
                  <Heading>{children}</Heading>
                )
              },
              props: { content: el.text }
            })

          const Component = wrapMarks(markComps)
          markupContent.push(function Heading () {
            return <Component>{headingContent}</Component>
          })
        })
      } else {
        markupContent.push(function TextComp () {
          return (
            <p>
              <br />
            </p>
          )
        })
      }

      break
    case 'bulletList':
      let bulletListArr = []
      element.content.length > 0 &&
        element.content?.map(listItem => {
          let markComps = []
          return listItem.content?.map(listItemContent => {
            return listItemContent.content?.map((content, i) => {
              if (content.marks !== undefined) {
                getMarks(content.marks, markComps)
              }
              if (content.text !== undefined)
                markComps.push({
                  component: ({ children }) => <li>{children}</li>,
                  props: { content: content.text }
                })
              const Component = wrapMarks(markComps)
              bulletListArr.push(function Li () {
                return <Component>{content.text}</Component>
              })
            })
          })
        })
      markupContent.push(function UlWrapper () {
        return (
          <Ul>
            {bulletListArr.map((Li, i) => (
              <Li key={i} />
            ))}
          </Ul>
        )
      })
      break
    case 'orderedList':
      let orderedList = []
      element.content.length > 0 &&
        element.content?.map(listItem => {
          let markComps = []
          return listItem.content?.map(listItemContent => {
            return listItemContent.content?.map((content, i) => {
              if (content.marks !== undefined) {
                getMarks(content.marks, markComps)
              }
              if (content.text !== undefined)
                markComps.push({
                  component: ({ children }) => <li>{children}</li>,
                  props: { content: content.text }
                })
              const Component = wrapMarks(markComps)
              orderedList.push(function Li () {
                return <Component>{content.text}</Component>
              })
            })
          })
        })
      markupContent.push(function UlWrapper () {
        return (
          <Ol>
            {orderedList.map((Li, i) => (
              <Li key={i} />
            ))}
          </Ol>
        )
      })
      break
    case 'blockquote':
      element.content.length > 0 &&
        element.content.map(listItem => {
          console.log(listItem)
          selectComponentType(
            listItem,
            markupContent,
            (Wrapper = ({ children }) => <Blockquote>{children}</Blockquote>)
          )
        })
      break
    default:
      console.log(element.type)
      if (element.type !== 'text') {
        const Comp = components[element.type]
        markupContent.push(function Default () {
          return <Comp />
        })
      }
      break
  }
}

export const getComponents = doc => {
  const response = {}
  for (let [key, value] of Object.entries(doc)) {
    if (key !== 'id' && key !== 'createdAt') {
      let Comp = components[value.type]

      // Richt text mapping

      if (value.type === 'richtext') {
        const markupContent = []
        console.log(value.value.content)
        value.value.content?.length > 0 &&
          value.value.content.map(element => {
            selectComponentType(element, markupContent)
          })
        response[capitalize(key)] = () => {
          return markupContent.map((Comp, i) => {
            return <Comp key={i} />
          })
        }
      } else if (value.type === 'image') {
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
