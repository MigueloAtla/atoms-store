import { useRouter } from 'next/router'
import { useUser } from '@/hooks/useUser'
import { useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { ChakraProvider, Flex, Spinner } from '@chakra-ui/react'

import styled from 'styled-components'

export default function Admin () {
  const [user, admin, loading] = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !admin) {
      router.push('/')
    }
  }, [admin, loading, router])

  return (
    <ChakraProvider>
      <Styles>
        {loading ? (
          <Flex w='100vw' h='100vh' justify='center' align='center'>
            <Spinner size='xl' />
          </Flex>
        ) : (
          admin && <AdminLayout />
        )}
      </Styles>
    </ChakraProvider>
  )
}

const Styles = styled.div`
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
`
