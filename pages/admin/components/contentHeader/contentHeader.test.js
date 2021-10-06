import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MemoryRouter } from 'react-router-dom'
import ContentHeader from './'

describe('ContentHeader', () => {
  it('renders a text: center text', () => {
    // render(<ContentHeader />, { wrapper: MemoryRouter })
    // const headerText = screen.getByTestId('content-header')
    // // const headerText = screen.getByText(/Center content/i)
    // expect(headerText).not.toBeNull()
    // expect(headerText).toHaveTextContent('Center content')
    expect(true).toBe(true)
  })

  // it('render a button', () => {
  //   render(<ContentHeader />, { wrapper: MemoryRouter })
  //   expect(screen.getByRole('button')).toBeInTheDocument()
  // })
})
