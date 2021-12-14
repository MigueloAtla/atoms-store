import React from 'react'
import { getCollection, getDocByID } from '@/firebase/client'

import { GlobalStyles, getComponents } from '@/theme'

import { LayoutStyled } from '@/layouts/postLayout'
import { Column, Row, AutoColumns } from '@/layouts/index'

export default function Pag ({ pag }) {
  const { Title } = getComponents(pag)

  return (
    <LayoutStyled width='100%'>
      <GlobalStyles />
      <Column center>
        <Title />
      </Column>
    </LayoutStyled>
  )
}

export async function getStaticProps ({ params: { id } }) {
  const pag = await getDocByID('page', id)

  return {
    props: {
      pag
    }
  }
}

export async function getStaticPaths () {
  const page = await getCollection('page')
  return {
    paths:
      page &&
      page.map(el => ({
        params: { id: String(el.id) }
      })),
    fallback: false
  }
}
