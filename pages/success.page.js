import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// utils
import { fetcher } from '../lib/utils'

// Firebase
import {
  addByCollectionType,
  addByCollectionTypeWithCustomIDBatched
} from '@/firebase/client'
// hooks
import useCart from '@/hooks/useCart'
import useSWR from 'swr'

const Success = () => {
  const { query: session_id } = useRouter()

  console.log(session_id.session_id)

  return (
    <div>
      <h1>{"Everything's fine"}</h1>
      <p>Check your email</p>
      {session_id.session_id !== undefined ? (
        <Data session_id={session_id.session_id} />
      ) : (
        <p>loading...</p>
      )}
    </div>
  )
}

const Data = ({ session_id }) => {
  console.log(session_id)
  const [message, setMessage] = useState(false)
  const { cartContent, clearCart } = useCart()
  const { data, error } = useSWR(
    () => `/api/checkout_sessions/${session_id}`,
    fetcher
  )
  useEffect(() => {
    // if (cartContent) clearCart()
  }, [cartContent])

  useEffect(() => {
    if (data) {
      console.log(data)
      setMessage(true)
      // console.log(cartContent)

      // set firestore checkout paid -> true
      // get cartContent substract product amount (stock)

      const checkout_data = {
        session_id: {
          isRequired: 'true',
          order: 0,
          type: 'text',
          value: data.id
        },
        total: {
          isRequired: 'true',
          order: 2,
          type: 'number',
          value: data.amount_total / 100
        },
        email: {
          isRequired: 'true',
          order: 1,
          type: 'text',
          value: data.customer_details.email
        }
      }

      // // not working
      const related_products = cartContent.map(el => el.product.id)

      // console.log(related_products)

      addByCollectionType('checkouts', checkout_data).then(function (docRef) {
        let newId = docRef.id
        let docsContent = []
        let idsArr = []
        related_products.map(id => {
          idsArr.push(`${newId}_${id}`)
          docsContent.push({
            checkoutsId: newId,
            productsId: id
          })
        })
        addByCollectionTypeWithCustomIDBatched(
          'junction_checkouts_products',
          idsArr,
          docsContent
        )
      })

      fetch('/api/mail', {
        method: 'post',
        body: JSON.stringify({ email: data.customer_details.email }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (res.status === 200) {
            // setSended(true)
            // reset()
          }
        })
        .catch(err => {
          console.log(err)
          // setError(true)
          // reset()
        })
    }
  }, [data])
  return (
    <div>
      <p>Success purchase</p>
      {message && <p>We have sent a email to {data.customer_details.email}</p>}
    </div>
  )
}

export default Success
