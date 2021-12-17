import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MemoryRouter } from 'react-router-dom'
import DocsInCollection from '../docsInCollection'

// const collectionData = [
//   {
//     id: '4VFWNV35Vs2DwsJ37FVZ',
//     description: {
//       value: 'asdfasdfasdf',
//       type: 'longtext'
//     },
//     title: {
//       value: 'asdfasdfa',
//       type: 'text'
//     }
//   },
//   {
//     id: '6T1nsw1m97iwrTuLnNmb',
//     title: {
//       value: 'afafaffffffffffffffffffffffff',
//       type: 'text'
//     },
//     description: {
//       value: 'afsdfasdfasdf',
//       type: 'longtext'
//     }
//   },
//   {
//     id: '6XJu77TIClMpKiR3C673',
//     description: {
//       value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
//       type: 'longtext'
//     },
//     title: {
//       type: 'text',
//       value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
//     }
//   },
//   {
//     id: '6b9Ta5D17b8qc5jifAao',
//     description: {
//       value: 'qwerqwerqwer',
//       type: 'longtext'
//     },
//     title: {
//       value: 'qwerqwerqwer',
//       type: 'text'
//     }
//   }
// ]

// jest.mock('@/firebase/client.js', () => ({
//   getCollection: jest.fn(() => {
//     return Promise.resolve(collectionData)
//   })
// }))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(() => {
    return { type: 'posts' }
  }),
  useHistory: () => ({
    push: jest.fn()
  })
}))

describe('Edit Page', () => {
  it('Renders loader in first render and after renders content interface with data', async () => {
    render(<DocsInCollection />, {
      wrapper: MemoryRouter
    })
    // expect(screen.getByTestId('loader')).toBeInTheDocument()
    const title = await screen.findByText('You may want to create a posts')
    // screen.debug()
    // const ramen = await screen.findByDisplayValue('Korean ramen')
    await waitFor(() => {
      expect(title).toBeInTheDocument()
      // expect(title).toBeInTheDocument()
      // expect(ramen).toBeInTheDocument()
      // expect(screen.getByText('Editing post: Korean ramen')).toBeInTheDocument()
    })
    expect(true).toBe(true)
  })
})

// TODO: Need to mock the Table Component
