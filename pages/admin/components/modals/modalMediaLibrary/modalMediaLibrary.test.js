import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import ModalMediaLibrary from '.'

const images = [
  'https://firebasestorage.googleapis.com/v0/b/next-firebase-6023b.appspot.com/o/images%2Fcalendar.jpg?alt=media&token=82f5d215-c75c-4a8c-bbc3-8c607c01cfb8'
]

jest.mock('@/firebase/client.js', () => ({
  getImages: jest.fn(() => Promise.resolve(images))
}))

// deactivated for deploy
// jest.mock('next/image', () => ({ src, alt }) => <img src={src} alt={alt} />)
jest.mock('react-cool-img', () => ({ src, alt }) => <img src={src} alt={alt} />)

describe('Modal', () => {
  it('Click on button opens modal and load Images', async () => {
    // expect(true).toBe(true)
    // deactivated for deploy
    render(<ModalMediaLibrary />)
    userEvent.click(screen.getByRole('button'))
    const title = await screen.findByText('Images in Media Library')
    expect(title).not.toBeNull()
    const image = await screen.findByRole('img')
    expect(image).toHaveAttribute('src', images[0])
  })
})
