import React from 'react'
import { useEffect } from 'react'
import {
  render,
  screen,
  fireEvent,
  createEvent,
  cleanup,
  waitFor
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import TextAreaImage from '.'
import useStore from '@/admin/store/store'

const images = [
  'https://firebasestorage.googleapis.com/v0/b/next-firebase-6023b.appspot.com/o/images%2Fcalendar.jpg?alt=media&token=82f5d215-c75c-4a8c-bbc3-8c607c01cfb8'
]

const task = {
  on: (e, onProgress, onError, onComplete) => {
    onComplete()
  },
  snapshot: {
    ref: {
      getDownloadURL: () => {
        return Promise.resolve(images[0])
      }
    }
  }
}

jest.mock('@/firebase/client.js', () => ({
  uploadImage: jest.fn(file => {
    return task
  })
}))

jest.mock('next/image', () => ({ src, alt }) => <img src={src} alt={alt} />)

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: () => ({
    register: () => jest.fn(),
    errors: () => jest.fn(),
    setValue: () => jest.fn()
  })
}))

const file = new File(['dummy content'], 'example.png', { type: 'image/png' })
// console.log(file.name)
const StoreWrapper = ({ withImage }) => {
  const setImgURL = useStore(state => state.setImgURL)

  useEffect(() => {
    withImage ? setImgURL(images[0]) : setImgURL('')
  }, [])

  return <TextAreaImage name='image' isRequired='false' />
}

describe('Input Image', () => {
  it('renders a textarea without image', async () => {
    render(<StoreWrapper />)
    expect(screen.queryByRole('img')).toBe(null)
    cleanup()
  })
  it('renders with a image', async () => {
    render(<StoreWrapper withImage />)
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('src', images[0])
    cleanup()
  })
  it('Uploads an image', async () => {
    render(<StoreWrapper />)
    const fileDropzone = screen.getByTestId('dropimage')
    const fileDropEvent = createEvent.drop(fileDropzone)

    Object.defineProperty(fileDropEvent, 'dataTransfer', {
      value: {
        files: [file]
      }
    })
    await waitFor(() => {
      fireEvent(fileDropzone, fileDropEvent)
    })
    const image = await screen.findByRole('img')
    expect(image).toHaveAttribute('src', images[0])
  })
})
