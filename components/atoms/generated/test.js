import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Generated from './'
describe('Generated', () => {
  it('renders and expect nothing', () => {
    render(<Generated />)
    expect(true).toHaveTextContent(true)
  })
})
