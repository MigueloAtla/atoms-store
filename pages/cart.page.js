// react / next
import { useEffect, useState } from 'react'
import Link from 'next/link'

import axios from 'axios'

// components
import { Column, Row, AutoColumns } from 'styled-bento'
import Img from 'react-cool-img'

// hooks
import useCart from '@/hooks/useCart'
import { useUser } from '@/hooks/useUser'
import { loadStripe } from '@stripe/stripe-js'
import getStripe from '../lib/get-stripe'

export default function Cart () {
  const [cartWithDiscount, setCartWithDiscount] = useState([])
  const { user } = useUser()
  const {
    cartContent,
    message,
    removeElement,
    clearCart,
    total,
    toggleCart,
    setToggleCart,
    getPrice
  } = useCart()

  useEffect(() => {
    let withDiscount = []
    if (cartContent) {
      withDiscount = cartContent.map(({ product, qty }) => {
        console.log(product)
        return {
          // product: { ...product, price: getPrice(product) },
          product,
          qty
        }
      })
    }
    setCartWithDiscount(withDiscount)
  }, [cartContent])

  const redirectToCheckout = async () => {
    console.log(cartContent)
    const {
      data: { id }
    } = await axios.post('/api/checkout_sessions', {
      products: cartContent.map(el => ({
        qty: el.qty,
        id: el.product.id,
        title: el.product.title,
        price: el.product.price
      })),
      items: cartContent.map(
        ({ product: { id, title, price, image }, qty }) => ({
          quantity: qty,
          price_data: {
            product_data: {
              name: title,
              images: [image]
            },
            currency: 'eur',
            unit_amount: price * 100
          }
        })
        // create checkout with cart content data and paid state false
      )
    })
    const stripe = await getStripe()
    await stripe.redirectToCheckout({ sessionId: id })
  }

  return (
    <>
      <Column center>
        {user && (
          <div>
            <h2>Cart</h2>
            {cartContent && (
              <>
                <RowAction
                  height='100'
                  gap='50'
                  data={cartWithDiscount}
                  actions={[removeElement]}
                />
                <span>Total: {total && total}</span>
                {/* <Link href='/checkout'> */}
                <button onClick={redirectToCheckout}>Checkout order</button>
                {/* </Link> */}
                <button onClick={clearCart}>Clear cart</button>
              </>
            )}
          </div>
        )}

        {message && <p>{message}</p>}
      </Column>
    </>
  )
}

const RowAction = ({
  data,
  actions: [removeElement],
  height = 'auto',
  gap = 0
}) => {
  return (
    <>
      {data ? (
        data.map((el, i) => {
          return (
            <Row key={i} height={height} gap={gap}>
              <p>{el.product.name}</p>
              {/* <Image
                width={height}
                height={height}
                layout='fixed'
                src={fromImageToUrl(el.product.image)}
              /> */}
              <Img src={el.product.image} width='80px' />
              <p>{el.qty}</p>
              <p>{el.product.price * el.qty}</p>
              {removeElement && (
                <div
                  size={15}
                  onClick={() => {
                    removeElement(el.product.id)
                  }}
                >
                  x{/* <Img src='/close.png' /> */}
                </div>
              )}
            </Row>
          )
        })
      ) : (
        <p>Nothing added to the cart</p>
      )}
    </>
  )
}
