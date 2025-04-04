
// Components
import Table from '@/admin/components/imagesTable'
import ImageUploader from '@/admin/components/imageUploader'
import { Flex, Grid, Box, Button } from '@chakra-ui/react'
import Img from 'react-cool-img'
import Masonry from 'react-masonry-css'
import * as Buttons from './buttons'

// HOC
import withPageHoc from '../pageHoc'

// utils
import { formatBytes } from '@/utils'

import {
  Drawer,
  DrawerOverlay,
  DrawerBody,
  DrawerContent,
} from '@chakra-ui/react'

// hooks
import { useInitialHook } from './initialHook'

import styled from 'styled-components'

const MediaLibrary = ({
  image,
  setImage,
  images,
  columns,
  data,
  mediaLibraryView,
  isOpen,
  onOpen,
  onClose,
  deleteImage,
  loadImages
}) => {

  const breakpointColumnsObj = {
    default: 5,
    1400: 4,
    1100: 3,
    880: 2,
    600: 1
  }

  return (
    <Box>
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
                    bg='secondary_bg'
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

      <Drawer onClose={onClose} isOpen={isOpen} size={'xs'}>
        <OverlayStyled />
        <ContentStyled bg="backdrop_bg" w='100%' maxW='calc(50vw)'>
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

export default withPageHoc({
  controller: useInitialHook,
  header: {
    back: false,
    title: 'Media library'
  },
  events: {
    hook: () => {},
    update: null,
    load: 'images'
  },
  buttons: Buttons,
  allowed_roles: ['admin', 'editor']
})(MediaLibrary)

const ImageWrapperStyled = styled(Flex)`
  flex-direction: 'column';
  padding: 10px;
  width: 200px;
  cursor: pointer;
  /* background-color: white; */
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
  /* background-color: #ffffffde; */
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
