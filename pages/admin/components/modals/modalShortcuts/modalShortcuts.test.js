import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import ModalShortcuts from '.'

describe('Modal Image Url', () => {
  it('Click on button opens modal', async () => {
    render(<ModalShortcuts />)
    userEvent.click(screen.getByRole('button'))
    expect(screen.getByText('Shortcut guide')).toBeInTheDocument()
  })
})
