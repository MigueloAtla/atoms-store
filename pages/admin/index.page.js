import { useRouter } from 'next/router'
import { useUser } from '@/hooks/useUser'
import { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import { ChakraProvider, Flex, Spinner, extendTheme, useColorMode, Button } from '@chakra-ui/react'
import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools'

import styled from 'styled-components'
import useStore from '@/admin/store/store'

import useRole from '@/admin/hooks/useRole'

// const ChangeButton = () => {
//   const { colorMode, toggleColorMode } = useColorMode()
//   // colorTheme
//   const { setColorTheme } = useStore(state => state)

//   useEffect(() => {
//     // set colorTheme
//     // console.log(colorMode)
//     setColorTheme(colorMode)
//   }, [colorMode])
  
//   return <Button onClick={toggleColorMode}>{colorMode}</Button>
// }

export default function Admin () {
  const [ currentTheme, setCurrentTheme ] = useState(lightTheme)
  const { role, loading } = useUser()
  const { allowed } = useRole(['admin', 'editor'])
  const router = useRouter()
  const { smallImageEditor, colorTheme, setColorTheme} = useStore(state => state)
  const { colorMode, toggleColorMode } = useColorMode()

  useEffect(() => {
    // console.log(colorTheme)
    // if(colorTheme === 'light') setCurrentTheme(lightTheme)
    // else setCurrentTheme(darkTheme)
    // console.log(colorTheme)
    // toggleColorMode()
    // if(colorMode === 'dark') toggleColorMode()
    setCurrentTheme(darkTheme)
  }, [colorTheme])

  // useEffect(() => {
  //   // set colorTheme
  //   // console.log(colorMode)
  //   setColorTheme(colorMode)
  // }, [colorMode])

  useEffect(() => {
    console.log(colorMode)
  }, [colorMode])
  
  // uncomment THIS
  useEffect(() => {
    // let theme = window.localStorage.getItem('chakra-ui-color-mode')
    // if(theme === undefined || theme === 'light') setCurrentTheme(lightTheme)
    // else setCurrentTheme(darkTheme)

    if (!loading && !allowed) {
      router.push('/')
    }
  }, [role, loading, router])

  return (
    <ChakraProvider theme={currentTheme}>
      <Styles smallImageEditor={smallImageEditor}>
      {/* <Button onClick={toggleColorMode}>{colorMode}</Button> */}
        {loading ? (
          <Flex w='100vw' h='100vh' justify='center' align='center'>
            <Spinner size='xl' />
          </Flex>
        ) : (
          allowed && 
          <AdminLayout />
        )}
      </Styles>
    </ChakraProvider>
  )
}

const lightTheme = extendTheme({
  // initialColorMode: 'light',
  // useSystemColorMode: false,
  colors: {
    background: '#f6f7f9',
    secondary_bg: '#ffffff',
    backdrop_bg: '#ffffffed',
    hover: 'rgb(236, 236, 241)',
    primary: 'red'
  }
})
const darkTheme = extendTheme({
  // initialColorMode: 'light',
  // useSystemColorMode: false,
  colors: {
    background: '#1c1f20',
    secondary_bg: '#181a1b',
    backdrop_bg: '#181a1bed',
    hover: '#2f3436',
    primary: 'blue'
  }
})

const Styles = styled.div`
  // styles for tiptap editor, move to editor comps
  h1 {
    font-size: 64px;
  }
  h2 {
    font-size: 38px;
  }
  h3 {
    font-size: 30px;
  }
  img {
    border: 2px solid transparent;
  }
  img.ProseMirror-selectednode {
    border: 2px solid #333;
    border-radius: 5px;
    transition: border 0.2s ease-in-out, opacity 0.2s ease-in-out;
    opacity: 0.8;
  }
  .ProseMirror img {
    height: ${({ smallImageEditor }) => smallImageEditor && '180px'};
  }
  blockquote {
    padding-left: 20px;
    margin-left: 5px;
    border-left: 2px solid black;
    background-color: grey;
  }
`