import React, { useEffect, useState } from 'react'
import { Flex, Grid, Box, Button } from '@chakra-ui/react'
import { getImagesData, deleteImage } from '@/firebase/client'
import PageTransitionAnimation from '../components/atoms/pageTransitionAnimation'
import LoadScreen from '@/admin/atoms/loadScreen'
import Img from 'react-cool-img'
import Masonry from 'react-masonry-css'

// Components
import Table from '@/admin/components/imagesTable'
import ImageUploader from '@/admin/components/imageUploader'

// utils
import { formatBytes } from '@/utils'

import {
  Drawer,
  DrawerOverlay,
  DrawerBody,
  DrawerContent,
  DrawerHeader
} from '@chakra-ui/react'

import { useDisclosure } from '@chakra-ui/hooks'

// State
import useStore from '@/admin/store/store'
import styled from 'styled-components'
import Header from '../components/header'

const TableImage = styled(Img)`
  overflow: hidden;
  object-fit: cover;
  height: 100%;
  width: 100%;
  transform: scale(1.1);
`

const MediaLibrary = () => {
  const setLoading = useStore(state => state.setLoading)
  const setMediaLibraryView = useStore(state => state.setMediaLibraryView)
  const mediaLibraryView = useStore(state => state.mediaLibraryView)
  const loading = useStore(state => state.loading)
  const [images, setImages] = useState({})
  const [image, setImage] = useState({})
  const { isOpen, onOpen, onClose } = useDisclosure()

  const loadImages = async () => {
    setLoading(true)
    const { urls, metadata } = await getImagesData()
    setImages({ urls, metadata })
  }
  useEffect(() => {
    setLoading(false)
  }, [images])

  useEffect(() => {
    loadImages()
  }, [])

  let arr = [
    { Header: 'name', accessor: 'name' },
    { Header: 'size', accessor: 'size' },
    { Header: 'image', accessor: 'url' }
  ]

  const columns = React.useMemo(() => arr, [])

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

  const data = React.useMemo(() => dataArr, [images])

  const breakpointColumnsObj = {
    default: 5,
    1400: 4,
    1100: 3,
    880: 2,
    600: 1
  }

  return (
    <Box>
      <Header title='Media Library'>
        <Button
          onClick={() => {
            setMediaLibraryView('table')
          }}
        >
          Table
        </Button>
        <Button
          onClick={() => {
            setMediaLibraryView('gallery')
          }}
        >
          Gallery
        </Button>
      </Header>
      {loading ? (
        <LoadScreen />
      ) : (
        <PageTransitionAnimation>
          <ImageUploader />
          {mediaLibraryView === 'table' && images?.urls?.length > 0 && (
            <Table data={data} columns={columns} />
          )}
          {mediaLibraryView === 'gallery' && (
            <GridStyled
              justifyItems='center'
              templateColumns='repeat(auto-fit, minmax(200px, 1fr))'
              templateRows='masonry'
            >
              <MasonryStyled
                breakpointCols={breakpointColumnsObj}
                columnClassName='my-masonry-grid_column'
              >
                {images?.urls &&
                  images.urls.map((image, i) => {
                    return (
                      <ImageWrapperStyled
                        key={i}
                        direction='column'
                        p='10px'
                        w='200px'
                        onClick={() => {
                          setImage({ url: image, metadata: images.metadata[i] })
                          onOpen()
                        }}
                      >
                        <Img
                          style={{
                            backgroundColor: '#efefef',
                            width: '480',
                            height: '320'
                          }}
                          width='200px'
                          height='200px'
                          src={image}
                          alt={`media-library-${i}`}
                        />
                        <p>
                          {images.metadata[i].name.replace(/\.[^/.]+$/, '')}
                        </p>
                      </ImageWrapperStyled>
                    )
                  })}
              </MasonryStyled>
            </GridStyled>
          )}
        </PageTransitionAnimation>
      )}

      <Drawer onClose={onClose} isOpen={isOpen} size={'xs'}>
        <OverlayStyled />
        <ContentStyled w='100%' maxW='calc(50vw)'>
          <DrawerBody p='0'>
            {isOpen && (
              <>
                <ImageExpanded>
                  <Img
                    src={image.url}
                    alt='opened image'
                    width='500px'
                    height='500px'
                  />
                </ImageExpanded>
                <Flex direction='column'>
                  <h3>Name: {image.metadata.name}</h3>
                  <p>Size: {formatBytes(image.metadata.size)}</p>
                  <p>Type: {image.metadata.contentType}</p>
                  <p>Created at: {image.metadata.timeCreated}</p>
                  <p>Last update: {image.metadata.updated}</p>
                  <Button
                    onClick={() => {
                      deleteImage(image.metadata.name)
                      onClose()
                      loadImages()
                      // setUpdate(s => !s)
                    }}
                  >
                    Delete Image
                  </Button>
                </Flex>
              </>
            )}
          </DrawerBody>
        </ContentStyled>
      </Drawer>
    </Box>
  )
}

export default MediaLibrary

const ImageWrapperStyled = styled(Flex)`
  flex-direction: 'column';
  padding: 10px;
  width: 200px;
  cursor: pointer;
  background-color: white;
  margin: 20px;
  border-radius: 10px;
  padding: 20px;
  p {
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`
const ImageExpanded = styled(Flex)`
  position: absolute;
  /* left: -200px; */
  transform: translateX(calc(-25vw - 210px)) translateY(calc(50vh - 250px));
`

const ContentStyled = styled(DrawerContent)`
  background-color: #ffffffde;
  backdrop-filter: blur(5px);
`
const OverlayStyled = styled(DrawerOverlay)`
  background-color: #000000de;
  backdrop-filter: blur(2px);
`
const GridStyled = styled(Grid)`
  /* background-color: white; */
  border-radius: 10px;
  padding: 20px;
`
const MasonryStyled = styled(Masonry)`
  display: flex;
  margin-left: -30px; /* gutter size offset */
  width: auto;
`
