import React, { useEffect, useState } from 'react'
import {
  cleanup,
  render,
  screen,
  waitFor,
  fireEvent
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Edit from '../editDoc/editDoc'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { theme } from '@/theme'
import useStore from '@/admin/store/store'
import userEvent from '@testing-library/user-event'

import 'regenerator-runtime/runtime'

const postTitle = {
  title: {
    type: 'text',
    value: 'Korean ramen'
  },
  description: {
    value: '',
    type: 'longtext'
  },
  featuredimage: {
    value: '',
    type: 'image'
  },
  content: {
    value: '',
    type: 'richtext'
  }
}

const postTitleAndDesc = {
  title: { ...postTitle.title },
  description: {
    value:
      'This style Korean ramen doesn’t exist in Korea. There’s no such thing as traditional Korean ramen. In Japan, the instant ramen came from a deep rooted love of traditional ramen. Instant ramen was invented in 1958. Fast food.',
    type: 'longtext'
  },
  featuredimage: {
    value: '',
    type: 'image'
  },
  content: {
    value: '',
    type: 'richtext'
  }
}

const postWithImage = {
  title: { ...postTitle.title },
  description: { ...postTitleAndDesc.description },
  featuredimage: {
    value:
      'https://firebasestorage.googleapis.com/v0/b/next-firebase-6023b.appspot.com/o/images%2Favatar.jpg?alt=media&token=80b289ea-af4f-436f-849f-39a16750d384',
    type: 'image'
  },
  content: {
    value: '',
    type: 'richtext'
  }
}

const content = {
  title: {
    type: 'text',
    value: 'Korean ramen'
  },
  description: {
    value:
      'This style Korean ramen doesn’t exist in Korea. There’s no such thing as traditional Korean ramen. In Japan, the instant ramen came from a deep rooted love of traditional ramen. Instant ramen was invented in 1958. Fast food.',
    type: 'longtext'
  },
  featuredimage: {
    value:
      'https://firebasestorage.googleapis.com/v0/b/next-firebase-6023b.appspot.com/o/images%2Favatar.jpg?alt=media&token=80b289ea-af4f-436f-849f-39a16750d384',
    type: 'image'
  },
  content: {
    value: '',
    type: 'richtext'
  }
}

const schemaByType = [
  {
    description: {
      order: 1,
      type: 'longtext',
      isRequired: false
    },
    title: {
      order: 2,
      type: 'text',
      isRequired: true
    },
    content: {
      order: 0,
      isRequired: false,
      type: 'richtext'
    },
    featuredimage: {
      order: 3,
      isRequired: true,
      type: 'image'
    }
  }
]

const mockFullSchemaByType = [
  {
    page: true,
    relations: [
      {
        display: false,
        name: 'junction_products_posts'
      },
      {
        display: true,
        name: 'junction_posts_test'
      }
    ],
    schema: {
      paid: {
        isRequired: false,
        order: 1,
        type: 'boolean'
      },
      total: {
        order: 2,
        type: 'number',
        isRequired: false
      },
      amount: {
        order: 0,
        value: 'number',
        isRequired: false,
        type: 'text'
      }
    },
    name: 'posts'
  }
]

const mockRelatedDocs = [
  {
    id: 'wXEdAq2gn0aMl70mh6RK',
    title: {
      value: 'test',
      type: 'text',
      order: 0,
      isRequired: true
    }
  }
]

const mockCollection = [
  {
    id: 'wXEdAq2gn0aMl70mh6RK',
    title: {
      value: 'test',
      order: 0,
      isRequired: true,
      type: 'text'
    }
  }
]

// jest.mock('next/image', () => ({ src, alt }) => <img src={src} alt={alt} />)

jest.mock('@/firebase/client.js', () => ({
  getDoc: jest.fn(() => {
    return Promise.resolve(content)
  }),
  getSchemaByType: jest.fn(() => {
    return Promise.resolve(schemaByType)
  }),
  getFullSchemaByType: jest.fn(() => {
    return Promise.resolve(mockFullSchemaByType)
  }),
  fetchRelatedDocs: jest.fn(() => {
    return Promise.resolve(mockRelatedDocs)
  }),
  getCollection: jest.fn(() => {
    return Promise.resolve(mockCollection)
  }),
  updateOneByType: jest.fn(() => {})
}))

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => {
    return { type: 'posts', id: '7DOEewpQD8cmJVIcxc75' }
  }),
  useHistory: () => ({
    push: jest.fn()
  })
}))

const Wrapper = ({ collection }) => {
  const setSelectedCollectionName = useStore(
    state => state.setSelectedCollectionName
  )

  setSelectedCollectionName(collection)

  return (
    <ThemeProvider theme={theme}>
      <Edit />
    </ThemeProvider>
  )
}

describe('Edit Page', () => {
  // beforeAll(() => {
  //   jest.useFakeTimers()
  // })

  afterEach(() => {
    cleanup()
  })

  // afterAll(() => {
  //   jest.useRealTimers()
  // })
  it('Loads the header', async () => {
    render(<Edit />, {
      wrapper: MemoryRouter
    })
    const header = await screen.findByTestId('header')
    const title = await screen.findByText('Editing post: Korean ramen')
    const updateButton = await screen.findByText('Update post')
    await waitFor(() => {
      expect(header).toBeInTheDocument()
      expect(title).toBeInTheDocument()
      expect(updateButton).toBeInTheDocument()
    })
  })
  it('Without data renders a load screen', async () => {
    render(<Edit />, {
      wrapper: MemoryRouter
    })
    await waitFor(() =>
      expect(screen.getByTestId('loader')).toBeInTheDocument()
    )
  })
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

  // it('Click on Preview button opens the preview panel with correct content', async () => {
  //   await waitFor(() =>
  //     render(<Wrapper collection='posts' />, {
  //       wrapper: MemoryRouter
  //     })
  //   )
  //   const title = await screen.findByDisplayValue('Korean ramen')
  //   const previewButton = screen.getByText('Preview')
  //   expect(previewButton).toBeInTheDocument()
  //   await fireEvent.click(previewButton)
  //   await waitFor(() => {
  //     expect(screen.getAllByText('Preview').length).toBe(2)
  //     expect(screen.getByText('Korean ramen')).toBeInTheDocument()
  //   })
  // })

  it('renders relations', async () => {
    await waitFor(() =>
      render(<Wrapper collection='posts' />, {
        wrapper: MemoryRouter
      })
    )
    const addButton = await screen.findByText('Add test')
    const showButton = await screen.findByText('show products')
    const relationResult = await screen.findByText('title: test')
    // const addButton = waitFor(() => screen.getByText('Add test'))
    // const showButton = waitFor(() => screen.getByText('show products'))
    // const relationResult = waitFor(() => screen.getByText('title: test'))
    expect(addButton).not.toBeNull()
    expect(showButton).not.toBeNull()
    expect(relationResult).not.toBeNull()
    // screen.debug(null, Infinity)
  })

  it('open relations modal and add a doc', async () => {
    await waitFor(() =>
      render(<Wrapper collection='posts' />, {
        wrapper: MemoryRouter
      })
    )
    const button = screen.getByText('Add test')
    await waitFor(() => {
      userEvent.click(button)
    })
    expect(screen.getByText('Select a test')).toBeInTheDocument()
    const checkbox = screen.getAllByRole('checkbox')
    fireEvent.click(checkbox[1])

    expect(screen.getByText('Add 1 test')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Add 1 test'))
    expect(screen.getAllByText('wXEdAq2gn0aMl70mh6RK')[1]).toBeInTheDocument()
    // screen.debug(null, Infinity)
  })
  it('Updates content', async () => {
    await waitFor(() =>
      render(<Wrapper collection='post' />, {
        wrapper: MemoryRouter
      })
    )

    const title = await screen.findByDisplayValue('Korean ramen')
    fireEvent.change(title, { target: { value: 'noodles' } })
    expect(screen.getByDisplayValue('noodles')).toBeInTheDocument()

    const update = screen.getByText('Update post')
    await fireEvent.click(update)
    await waitFor(() => {
      expect(screen.getByDisplayValue('noodles')).toBeInTheDocument()
    })
  })
})
