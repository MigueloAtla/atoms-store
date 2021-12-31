import React from 'react'
import { getCollection, getDocByID } from '@/firebase/client'

import { GlobalStyles, getComponents, components } from '@/theme'

import { LayoutStyled } from '@/layouts/index'
import { Column, Row, AutoColumns } from 'styled-bento'

export default function Post ({ post }) {
  const { Title, Description, Featuredimage, Content } = getComponents(post)

  return (
    <LayoutStyled width='100%'>
      <GlobalStyles />
      <Column center mark='yellow'>
        <Title as='h1' fontSize={[4, 5, '100px']} color='antiquewhite' />
        <Title as={components['h2']} color='antiquewhite' />
        <Description />
        <Featuredimage />
        <Column mt='20px'>{Content()}</Column>
      </Column>
    </LayoutStyled>
  )
}
export async function getStaticProps ({ params: { id } }) {
  const post = await getDocByID('posts', id)

  return {
    props: {
      post
    },
    revalidate: 60
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
    fallback: 'blocking'
  }
}
