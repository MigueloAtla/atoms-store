import { Button } from '@chakra-ui/react'

export const Button1 = ({
  setMediaLibraryView
}) => {
  return (
    <Button
      onClick={() => {
        setMediaLibraryView('table')
      }}
    >
      Table
    </Button>
  )
}

export const Button2 = ({
  setMediaLibraryView
}) => {
  return (
    <Button
      onClick={() => {
        setMediaLibraryView('gallery')
      }}
    >
      Gallery
    </Button>
  )
}