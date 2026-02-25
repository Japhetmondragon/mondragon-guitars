import { createContext, useState, useContext } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])

  const addToCart = (product, selectedOptions, quantity = 1) => {
    const id = `${product._id}-${JSON.stringify(selectedOptions)}`
    setCartItems(prev => {
      const existing = prev.find(item => item.cartId === id)
      if (existing) {
        return prev.map(item =>
          item.cartId === id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { ...product, cartId: id, selectedOptions, quantity }]
    })
  }

  const removeFromCart = (cartId) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId))
  }

  const updateQuantity = (cartId, quantity) => {
    if (quantity < 1) return
    setCartItems(prev =>
      prev.map(item => item.cartId === cartId ? { ...item, quantity } : item)
    )
  }

  const clearCart = () => setCartItems([])

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)