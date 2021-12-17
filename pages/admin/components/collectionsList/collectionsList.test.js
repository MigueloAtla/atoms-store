import React, { useEffect } from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import CollectionsList from '.'
import { MemoryRouter } from 'react-router-dom'

import useStore from '@/admin/store/store'

const StoreWrapper = ({ children }) => {
  const setCollections = useStore(state => state.setCollections)

  useEffect(() => {
    setCollections([
      { name: 'posts', page: true },
      { name: 'products', page: true },
      { name: 'projects', page: true },
      { name: 'checkouts', page: false }
    ])
  }, [])
  return <CollectionsList />
}

describe('Collections list', () => {
  it('Renders a list of the available collections', async () => {
    render(<StoreWrapper />, { wrapper: MemoryRouter })
    expect(screen.getByText('posts')).toBeInTheDocument()
    expect(screen.getByText('products')).toBeInTheDocument()
    expect(screen.getByText('projects')).toBeInTheDocument()
    expect(screen.getByText('checkouts')).toBeInTheDocument()
  })
})
