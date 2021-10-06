import React, { useEffect } from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import UpdateButton from '.'
import { MemoryRouter } from 'react-router-dom'

describe('Update button', () => {
  it('Renders: "Update: ${type}"', async () => {
    render(<UpdateButton type='posts' />)
    expect(screen.getByText('Update post')).toBeInTheDocument()
  })
})
