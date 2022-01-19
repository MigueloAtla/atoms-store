import Stripe from 'stripe'
import { buffer } from 'micro'

// Firebase
import {
  addByCollectionType,
  addByCollectionTypeWithCustomIDBatched,
  updateOneByType,
  updateDocFieldByType
} from '@/firebase/client'

// hooks
import useCart from '@/hooks/useCart'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler (req, res) {
  if (req.method === 'POST') {
    let event

    try {
      // 1. Retrieve the event by verifying the signature using the raw body and secret
      const rawBody = await buffer(req)
      const signature = req.headers['stripe-signature']

      event = stripe.webhooks.constructEvent(
        rawBody.toString(),
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err) {
      console.log(`❌ Error message: ${err.message}`)
      res.status(400).send(`Webhook Error: ${err.message}`)
      return
    }

    // Successfully constructed event
    console.log('✅ Success:', event.id)

    // 2. Handle event type (add business logic here)
    if (event.type === 'checkout.session.completed') {
      console.log(`💰  Payment received!`)
      console.log(event)
      console.log(event.data.object.id)

      const metadata = JSON.parse(event.data.object.metadata.ids)

      console.log('metadata: ', metadata)

      // stripe.checkout.sessions.listLineItems(event.data.object.id, function (
      //   err,
      //   lineItems
      // ) {
      //   // asynchronously called
      //   if (err) return
      //   lineItems.data.map(item => {
      //     console.log('item: ', item)
      //   })
      // })

      metadata.map(prod => {
        updateDocFieldByType(prod.id, 'products', 'amount', prod.qty)
      })

      const checkout_data = {
        session_id: {
          isRequired: 'true',
          order: 0,
          type: 'text',
          value: event.data.object.id
        },
        total: {
          isRequired: 'true',
          order: 2,
          type: 'number',
          value: event.data.object.amount_total / 100
        },
        email: {
          isRequired: 'true',
          order: 1,
          type: 'text',
          value: event.data.object.customer_details.email
        }
      }

      // // not working
      // const related_products = cartContent.map(el => el.product.id)

      addByCollectionType('checkouts', checkout_data).then(function (docRef) {
        let newId = docRef.id
        let docsContent = []
        let idsArr = []

        metadata.map(({ id }) => {
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

      fetch('http://localhost:3000/api/mail', {
        method: 'post',
        body: JSON.stringify({
          email: event.data.object.customer_details.email,
          products: metadata,
          total: event.data.object.amount_total / 100
        }),
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
    } else {
      console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`)
    }

    // 3. Return a response to acknowledge receipt of the event.
    res.json({ received: true })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
