import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Edit from '../edit'
import { MemoryRouter } from 'react-router-dom'

const content = {
  description: {
    value:
      'This style Korean ramen doesn’t exist in Korea. There’s no such thing as traditional Korean ramen. In Japan, the instant ramen came from a deep rooted love of traditional ramen. Instant ramen was invented in 1958. Fast food.',
    type: 'longtext'
  },
  title: {
    type: 'text',
    value: 'Korean ramen'
  }
}

jest.mock('@/firebase/client.js', () => ({
  fetchOneByType: jest.fn(() => {
    return Promise.resolve(content)
  })
}))

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => {
    return { type: 'posts', id: '7DOEewpQD8cmJVIcxc75' }
  }),
  useHistory: () => ({
    push: jest.fn()
  })
}))

describe('Edit Page', () => {
  // beforeAll(() => {
  //   jest.useFakeTimers()
  // })

  // afterAll(() => {
  //   jest.useRealTimers()
  // })
  // it('Loads the header', async () => {
  //   render(<Edit />, {
  //     wrapper: MemoryRouter
  //   })
  //   expect(screen.getByTestId('header')).toBeInTheDocument()
  //   expect(screen.getByText('Editing post:')).toBeInTheDocument()
  //   expect(screen.getByText('Update post')).toBeInTheDocument()
  // })
  // it('Without data renders a load screen', async () => {
  //   render(<Edit />, {
  //     wrapper: MemoryRouter
  //   })
  //   screen.debug()
  //   expect(screen.getByTestId('loader')).toBeInTheDocument()
  // })
  it('Renders loader in first render and after renders content interface with data', async () => {
    render(<Edit />, {
      wrapper: MemoryRouter
    })
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByText('Editing post:')).toBeInTheDocument()
    expect(screen.getByText('Update post')).toBeInTheDocument()
    expect(screen.getByTestId('loader')).toBeInTheDocument()
    const title = await screen.findByText('Title')
    const ramen = await screen.findByDisplayValue('Korean ramen')
    await waitFor(() => {
      expect(title).toBeInTheDocument()
      expect(ramen).toBeInTheDocument()
      expect(screen.getByText('Editing post: Korean ramen')).toBeInTheDocument()
    })
  })
})
