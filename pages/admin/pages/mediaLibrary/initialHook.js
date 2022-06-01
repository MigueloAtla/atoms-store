// react
import { useState, useEffect, useMemo } from "react"

// firebase
import { getImagesData, deleteImage } from '@/firebase/client'

// components
import Img from 'react-cool-img'
import { Box } from '@chakra-ui/react'

//hooks
import { useDisclosure } from '@chakra-ui/hooks'

// utils
import { formatBytes } from '@/utils'

// store
import useStore from '@/admin/store/store'
import styled from "styled-components"

const TableImage = styled(Img)`
  overflow: hidden;
  object-fit: cover;
  height: 100%;
  width: 100%;
  transform: scale(1.1);
`

export const useInitialHook = () => {
  const {
    mediaLibraryView,
    setMediaLibraryView,
  } = useStore(state => state)

  const [images, setImages] = useState({})
  const [image, setImage] = useState({})
  
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  const loadImages = async () => {
    // setLoading(true)
    const { urls, metadata } = await getImagesData()
    setImages({ urls, metadata })
    
  }
  // useEffect(() => {
  //   setLoading(false)
  // }, [images])
  
  useEffect(() => {
    loadImages()
  }, [])


  // table preparation
  let arr = [
    { Header: 'name', accessor: 'name' },
    { Header: 'size', accessor: 'size' },
    { Header: 'image', accessor: 'url' }
  ]

  const columns = useMemo(() => arr, [])

  let dataArr = []

  if (images?.urls?.length > 0) {
    images.urls.map((image, i) => {
      dataArr.push({
        name: images.metadata[i].name.replace(/\.[^/.]+$/, ''),
        url: (
          <Box border='1px solid #333' w='80px' h='80px' overflow='hidden'>
            <TableImage
              style={{
                backgroundColor: '#efefef',
                width: '90',
                height: '90'
              }}
              quality='50'
              src={image}
              alt='main image'
              width='90px'
              height='90px'
              layout='fixed'
            />
          </Box>
        ),
        size: formatBytes(images.metadata[i].size)
      })
    })
  }

  const data = useMemo(() => dataArr, [images])

  return {
    image,
    images,
    setImage,
    setImages,
    loadImages,
    deleteImage,
    columns,
    data,
    mediaLibraryView,
    setMediaLibraryView,
    isOpen,
    onOpen,
    onClose
  }
  
}