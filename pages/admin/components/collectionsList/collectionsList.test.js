import React, { useEffect } from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import CollectionsList from '.'
import { MemoryRouter } from 'react-router-dom'

import useStore from '@/admin/store/store'

const StoreWrapper = ({ children }) => {
  const setCollections = useStore(state => state.setCollections)

  useEffect(() => {
    setCollections(['Posts', 'Projects', 'Recipes', 'Albums'])
  }, [])

  return <CollectionsList />
}

describe('Collections list', () => {
  it('Renders a list of the available collections', async () => {
    render(<StoreWrapper />, { wrapper: MemoryRouter })
    expect(screen.getByText('Posts')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Recipes')).toBeInTheDocument()
    expect(screen.getByText('Albums')).toBeInTheDocument()
  })
})
