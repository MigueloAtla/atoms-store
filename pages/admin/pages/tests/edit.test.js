import React from 'react'
import {
  cleanup,
  render,
  screen,
  waitFor,
  fireEvent
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Edit from '../edit'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { theme } from '@/theme'
import useStore from '@/admin/store/store'

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

jest.mock('next/image', () => ({ src, alt }) => <img src={src} alt={alt} />)

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

const Wrapper = ({ collection }) => {
  const setSelectedCollectionName = useStore(
    state => state.setSelectedCollectionName
  )

  setSelectedCollectionName(collection)
  // useEffect(() => {
  // }, [])
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
    cleanup()
  })

  it('Click on Preview button opens the preview panel', async () => {
    await waitFor(() =>
      render(<Wrapper collection='posts' />, {
        wrapper: MemoryRouter
      })
    )
    const previewButton = screen.getByText('Preview')
    expect(previewButton).toBeInTheDocument()
    await fireEvent.click(previewButton)
    await waitFor(() => {
      expect(screen.getAllByText('Preview').length).toBe(2)
    })
  })
})
