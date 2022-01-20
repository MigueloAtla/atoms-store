import create from 'zustand'
import { devtools } from 'zustand/middleware'

const store = set => ({
  // state
  user: null,
  admin: false,
  cartContent: null,
  message: null,
  total: 0,
  toggleCart: false,

  // actions
  setUser: data => set({ user: data }),
  setAdmin: data => set({ admin: data }),
  setCartContent: data => set({ cartContent: data }),
  setMessage: data => set({ message: data }),
  setTotal: data => set({ total: data }),
  setToggleCart: data => set({ toggleCart: data })
})

const useStore = create(devtools(store))

export default useStore
