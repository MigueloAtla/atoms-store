import React from 'react'
import { getCollection, getDocByID } from '@/firebase/client'

import { GlobalStyles, getComponents, getValues } from '@/theme'

import { LayoutStyled } from '@/layouts/index'
import { Column, Row, AutoColumns } from 'styled-bento'

import useCart from '@/hooks/useCart'
import { useState } from 'react'

const ProductView = ({ productComps, productValues }) => {
  const { Title, Description, Price, Image, Amount } = productComps
  const { addToCart } = useCart()
  const [qty, setQty] = useState(0)

  return (
    <LayoutStyled width='100%'>
      <GlobalStyles />
      <Column center>
        <Title />
        <Description />
        <Price />
        <Image alt='pro' />
        <Amount />
        {/* <form> */}
        <label>Quantity</label>
        <input
          type='number'
          value={qty}
          onChange={e => {
            setQty(e.target.value)
          }}
        />
        <button
          onClick={() => {
            addToCart({ product: productValues, qty })
          }}
        >
          Add to cart
        </button>
        {/* </form> */}
      </Column>
    </LayoutStyled>
  )
}

export default function Product ({ product }) {
  const productComps = getComponents(product)
  const productValues = getValues(product)

  return (
    <ProductView productComps={productComps} productValues={productValues} />
  )
}

export async function getStaticProps ({ params: { id } }) {
  const product = await getDocByID('products', id)
  console.log(product)

  return {
    props: {
      product
    }
  }
}

export async function getStaticPaths () {
  const products = await getCollection('products')
  console.log(products)
  return {
    paths:
      products &&
      products.map(el => ({
        params: { id: String(el.id) }
      })),
    fallback: false
  }
}
