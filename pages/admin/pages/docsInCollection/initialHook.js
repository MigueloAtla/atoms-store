// react
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// firebase
import { getCollection } from '@/firebase/client'

// store
import useStore from '@/admin/store/store'

// Hooks
import usePrepareTable from '../../hooks/prepareDocsTable'

export const useInitialHook = () => {
  const [removeList, setRemoveList] = useState([])
  const {
    collectionData,
    selectedCollectionName,
    setSelectedCollectionName,
    setCollectionData,
    setRerender,
    rerender
  } = useStore(state => state)

  const { data, columns } = usePrepareTable({
    collection: collectionData,
    deleteCol: true
  })

  const { type } = useParams()

  useEffect(() => {
    getCollection(type).then(c => {
      setCollectionData(c)
    })
    // if (selectedCollectionName === '') {
    //   setSelectedCollectionName(type)
    // }
  }, [rerender])

  return {
    data, 
    columns,
    collectionData,
    setCollectionData,
    selectedCollectionName,
    setSelectedCollectionName,
    rerender,
    setRerender,
    type,
    removeList,
    setRemoveList
  }
}