import { useRouter } from 'next/router'
import { useUser } from '@/hooks/useUser'
import { useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { ChakraProvider, Flex, Spinner } from '@chakra-ui/react'

import styled from 'styled-components'
import useStore from '@/admin/store/store'

import useRole from '@/admin/hooks/useRole'

export default function Admin () {
  const { role, loading } = useUser()
  const { allowed } = useRole(['admin', 'editor'])
  const router = useRouter()
  const smallImageEditor = useStore(state => state.smallImageEditor)

  useEffect(() => {
    if (!loading && !allowed) {
      router.push('/')
    }
  }, [role, loading, router])

  return (
    <ChakraProvider>
      <Styles smallImageEditor={smallImageEditor}>
        {loading ? (
          <Flex w='100vw' h='100vh' justify='center' align='center'>
            <Spinner size='xl' />
          </Flex>
        ) : (
          allowed && <AdminLayout />
        )}
      </Styles>
    </ChakraProvider>
  )
}

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
