import create from 'zustand'
import { devtools } from 'zustand/middleware'

const store = set => ({
  // state
  collections: [],
  collectionData: [],
  selectedCollectionName: '',
  id: null,
  loading: false,
  imgURL: '',
  rerender: false,
  smallImageEditor: false,
  expandedEditor: false,
  mediaLibraryView: 'table',
  selectedSidebarMenu: 'home',
  toggleCollectionsPanel: false,
  removeList: [],
  composedId: '',
  relation: {},
  composedId: '',
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
  setMediaLibraryView: data => set({ mediaLibraryView: data }),
  setSelectedSidebarMenu: data => set({ selectedSidebarMenu: data }),
  setToggleCollectionsPanel: data => set({ toggleCollectionsPanel: data }),
  setRemoveList: data => set({ removeList: data }),
  setComposedId: data => set({ composedId: data }),
  setRelation: data => set({ relation: data }),
  setComposedId: data => set({ composedId: data })
})

const useStore = create(store)

export default useStore
