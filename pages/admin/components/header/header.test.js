import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MemoryRouter } from 'react-router-dom'
import ContentHeader from './'

describe('ContentHeader', () => {
  it('renders a text: center text', () => {
    render(<ContentHeader title={'posts'} />, {
      wrapper: MemoryRouter
    })
    const headerText = screen.getByText('posts')
    expect(headerText).not.toBeNull()
    expect(headerText).toHaveTextContent('posts')
  })

  // it('render a button', () => {
  //   render(<ContentHeader />, { wrapper: MemoryRouter })
  //   expect(screen.getByRole('button')).toBeInTheDocument()
  // })
})
