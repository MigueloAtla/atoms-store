import { useEffect } from 'react'
import useStore from '@/store/store'

export const useCart = props => {
  const {
    cartContent,
    setCartContent,
    message,
    setMessage,
    total,
    setTotal,
    toggleCart,
    setToggleCart
  } = useStore()

  /**
   * Add to Cart
   * @param {object, int} product, qty
   */
  const addToCart = ({ product, qty }) => {
    console.log(product)
    let cart_stored = []
    let session_cart = JSON.parse(sessionStorage.getItem('cart'))

    if (product.amount > 0) {
      let already_in_cart = session_cart
        ? session_cart.filter(el => el.product.id === product.id)
        : []

      // if the product exist in cart - adds qty to the product
      if (already_in_cart.length > 0) {
        let p = session_cart.filter(el => el.product.id === product.id)
        if (parseInt(p[0].qty) + parseInt(qty) > parseInt(product.amount)) {
          setMessage(`There's no enought stock of the product`)
          return
        }
        cart_stored = session_cart.map(el => {
          if (el.product.id === product.id) {
            el.qty = parseInt(el.qty) + parseInt(qty)
          }
          return el
        })
      }

      // if the product is not in the cart - add the product
      else {
        session_cart && cart_stored.push(...session_cart)

        let new_product = {
          product,
          qty
        }
        cart_stored.push(new_product)
      }

      // write the result array into the session
      sessionStorage.setItem('cart', JSON.stringify(cart_stored))
      setCartContent(cart_stored)
      setMessage('Product added successfully')
    } else {
      setMessage("Can' add the product")
    }
  }

  /**
   * Get Cart
   */
  const getFromCart = () => {
    let session_cart = JSON.parse(sessionStorage.getItem('cart'))
    if (session_cart) setCartContent(session_cart)
  }

  /**
   * Remove Cart Element
   */
  const removeElement = id => {
    let cartContent_temp = cartContent

    var removeIndex = cartContent_temp.map(item => item.product.id).indexOf(id)

    ~removeIndex && cartContent_temp.splice(removeIndex, 1)

    sessionStorage.setItem('cart', JSON.stringify(cartContent_temp))
    if (cartContent_temp.length === 0) {
      setCartContent(null)
    } else {
      setCartContent([...cartContent_temp])
    }
  }

  /**
   * Clear Cart
   */
  const clearCart = () => {
    sessionStorage.setItem('cart', null)
    setCartContent(null)
  }

  /**
   * Discount price ?
   */
  const isDiscount = product => {
    return product.discount_price !== '' && product.discount_price !== null
  }
  const getPrice = product => {
    return product.discount_price !== '' && product.discount_price !== null
      ? product.discount_price
      : product.price
  }

  /**
   * Discount Coupon: update total ?
   */
  const totalWithDiscount = ({ amount, type }) => {
    if (type === 'price_amount') {
      setTotal(t => {
        return t - amount
      })
    }
  }

  /**
   * Get total
   */
  const getTotal = () => {
    let total = 0
    cartContent &&
      cartContent.map(el => {
        // total += getPrice(el.product) * el.qty
        total += el.product.price * el.qty
      })
    setTotal(total)
  }

  /**
   * Reload user login on app refresh
   */
  useEffect(() => {
    getTotal()
  }, [cartContent])
  useEffect(() => {
    getFromCart()
  }, [])

  return {
    cartContent,
    addToCart,
    removeElement,
    clearCart,
    message,
    total,
    toggleCart,
    setToggleCart,
    getPrice,
    isDiscount,
    totalWithDiscount
  }
}

export default useCart
