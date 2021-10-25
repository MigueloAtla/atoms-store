const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const atomIndexTemplate = name => {
  return `import React from 'react'
  
const ${capitalizeFirstLetter(name)} = () => {
  return (
    <p>${name}</p>
    )
  }
export default ${capitalizeFirstLetter(name)}
`
}

export const atomStylesTemplate = (name, type) => {
  return `import styled from 'styled-components'
import {${type}} from 'rebass/styled-components'
  
export const ${capitalizeFirstLetter(name)}Styled = styled(${type})\`
  border: 1px solid black;
\`
  `
}

export const atomTestTemplate = name => {
  return `import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import ${capitalizeFirstLetter(name)} from './'

describe('${capitalizeFirstLetter(name)}', () => {
  it('renders and expect nothing', () => {
    render(<${capitalizeFirstLetter(name)} />)
    expect(true).toHaveTextContent(true)
  })
})`
}
