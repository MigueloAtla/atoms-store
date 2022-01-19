import React from 'react'
import Link from 'next/link'
import { getCollection } from '@/firebase/client'
import { Column, Row, Flex } from 'styled-bento'
import Img from 'react-cool-img'

export default function Products ({ products }) {
  console.log(products)
  return (
    <div>
      <h1>Products</h1>
      <Flex>
        {products?.length > 0 &&
          products.map((product, i) => {
            return (
              <Link key={i} href={`products/${product.id}`}>
                <Column width='200px'>
                  <p>{product.title.value}</p>
                  <Img src={product.image.value} />
                  <p>{product.price.value} €</p>
                </Column>
              </Link>
            )
          })}
      </Flex>
    </div>
  )
}

export async function getStaticProps () {
  const products = await getCollection('products')

  return {
    props: {
      products
    }
  }
}
