import create from 'zustand'
import { devtools } from 'zustand/middleware'

const store = set => ({
  // state
  collections: [],
  collectionData: [],
  selectedCollectionName: '',
  id: null,
  loading: false,
  imgURL: null,
  rerender: false,
  smallImageEditor: false,
  expandedEditor: false,
  mediaLibraryView: 'table',
  // actions
  setCollections: data => set({ collections: data }),
  setCollectionData: data => set({ collectionData: data }),
  setSelectedCollectionName: data => set({ selectedCollectionName: data }),
  setId: data => set({ id: data }),
  setLoading: data => set({ loading: data }),
  setImgURL: data => set({ imgURL: data }),
  setRerender: data => set({ rerender: data }),
  setSmallImageEditor: data => {
    return set({ smallImageEditor: data })
  },
  setExpandedEditor: data => {
    return set({ expandedEditor: data })
  },
  setMediaLibraryView: data => set({ mediaLibraryView: data })
})

const useStore = create(devtools(store))

export default useStore
