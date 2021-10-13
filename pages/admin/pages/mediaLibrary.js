import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Flex, Grid, Box, Button } from '@chakra-ui/react'
import { getImagesData, deleteImage } from '@/firebase/client'
import PageTransitionAnimation from '../components/atoms/pageTransitionAnimation'
import LoadScreen from '@/admin/atoms/loadScreen'

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

const MediaLibrary = () => {
  const setLoading = useStore(state => state.setLoading)
  const [update, setUpdate] = useState(false)
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

  return (
    <Box m='50px'>
      <h2>Media Library</h2>
      {loading ? (
        <LoadScreen />
      ) : (
        <PageTransitionAnimation>
          <GridStyled
            justifyItems='center'
            templateColumns='repeat(auto-fit, minmax(200px, 1fr))'
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
                    <Image
                      width='200px'
                      height='200px'
                      src={image}
                      alt={`media-library-${i}`}
                    />
                    <p>{images.metadata[i].name.replace(/\.[^/.]+$/, '')}</p>
                  </ImageWrapperStyled>
                )
              })}
          </GridStyled>
        </PageTransitionAnimation>
      )}

      <Drawer onClose={onClose} isOpen={isOpen} size={'xs'}>
        <OverlayStyled />
        <ContentStyled w='100%' maxW='calc(50vw)'>
          <DrawerBody p='0'>
            {isOpen && (
              <>
                <ImageExpanded>
                  <Image
                    src={image.url}
                    alt='opened image'
                    width='500px'
                    height='500px'
                  />
                </ImageExpanded>
                <Flex direction='column'>
                  <h3>Name: {image.metadata.name}</h3>
                  <p>Size: {image.metadata.size}</p>
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
  background-color: white;
  border-radius: 10px;
  padding: 20px;
`
