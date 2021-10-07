import React from 'react'
// import Image from 'next/image'
import { getCollection, getDocByID } from '@/firebase/client'

import { withTheme, PostWrapperStyled } from '@/theme'

// import { Box } from 'rebass/styled-components'
// import { Box } from '@/atoms'
import styled from 'styled-components'
import { LayoutStyled } from '@/layouts/postLayout'

export default function Post ({ post }) {
  const { Title, Description, Featuredimage, Content } = withTheme(post)

  return (
    <LayoutStyled width={['80%', '70%', '60%']}>
      <PostWrapperStyled mt='100px'>
        <Title as='h2' mt={[4, 5, 6]} fontSize={[4, 5, 7]} />
        <Featuredimage />
        <Description />
        {Content()}
      </PostWrapperStyled>
    </LayoutStyled>
  )
}

export async function getStaticProps ({ params: { id } }) {
  const post = await getDocByID('posts', id)

  return {
    props: {
      post
    }
  }
}

export async function getStaticPaths () {
  const posts = await getCollection('posts')
  return {
    paths:
      posts &&
      posts.map(el => ({
        params: { id: String(el.id) }
      })),
    fallback: false
  }
}
