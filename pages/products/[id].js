import React from 'react'
import { getCollection, getDocByID } from '@/firebase/client'

import { GlobalStyles, getComponents } from '@/theme'

import { LayoutStyled } from '@/layouts/postLayout'
import { Column, Row, AutoColumns } from '@/layouts/index'

export default function Product ({ product }) {
  const { Desc, Title } = getComponents(product)

  return (
    <LayoutStyled width='100%'>
      <GlobalStyles />
      <Column center>
        <Title as='h1' />
        <Desc />
      </Column>
    </LayoutStyled>
  )
}

export async function getStaticProps ({ params: { id } }) {
  const product = await getDocByID('product', id)

  return {
    props: {
      product
    }
  }
}

export async function getStaticPaths () {
  const products = await getCollection('products')
  return {
    paths:
      products &&
      products.map(el => ({
        params: { id: String(el.id) }
      })),
    fallback: false
  }
}
