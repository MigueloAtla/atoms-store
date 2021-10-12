import React, { useEffect } from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import useStore from '@/admin/store/store'
import Preview from '.'
import { ThemeProvider } from 'styled-components'
import { theme } from '@/theme'

// const images = [
//   'https://firebasestorage.googleapis.com/v0/b/next-firebase-6023b.appspot.com/o/images%2Fcalendar.jpg?alt=media&token=82f5d215-c75c-4a8c-bbc3-8c607c01cfb8'
// ]

// jest.mock('@/firebase/client.js', () => ({
//   getImages: jest.fn(() => Promise.resolve(images))
// }))

jest.mock('next/image', () => ({ src, alt }) => <img src={src} alt={alt} />)

const postTitle = {
  title: {
    value: 'Atoms for peace',
    type: 'text'
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
    value: 'Something to describe',
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

const Wrapper = ({ collection, content }) => {
  const setSelectedCollectionName = useStore(
    state => state.setSelectedCollectionName
  )

  setSelectedCollectionName(collection)
  // useEffect(() => {
  // }, [])
  return (
    <ThemeProvider theme={theme}>
      <Preview content={content} />
    </ThemeProvider>
  )
}

afterEach(() => {
  cleanup()
})

describe('Preview', () => {
  it('Renders a post with title', async () => {
    render(<Wrapper collection='posts' content={postTitle} />)

    expect(screen.getByText(postTitle.title.value)).toBeInTheDocument()
  })
  it('Renders a post with title and description', async () => {
    render(<Wrapper collection='posts' content={postTitleAndDesc} />)

    expect(screen.getByText(postTitleAndDesc.title.value)).toBeInTheDocument()
    expect(
      screen.getByText(postTitleAndDesc.description.value)
    ).toBeInTheDocument()
  })

  it('Renders a post with title, description, and a image', async () => {
    render(<Wrapper collection='posts' content={postWithImage} />)

    expect(screen.getByText(postWithImage.title.value)).toBeInTheDocument()
    expect(
      screen.getByText(postWithImage.description.value)
    ).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      postWithImage.featuredimage.value
    )
  })
})
