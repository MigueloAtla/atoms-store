import React, { useEffect, useState } from 'react'
import Image from 'next/image'

import styled from 'styled-components'

import {
  Box,
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'

import { getImages } from '@/firebase/client'

import Masonry from 'react-masonry-css'

const ModalImages = ({ setImgURL }) => {
  const [images, setImages] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    const loadImages = async () => {
      const urls = await getImages()
      setImages(urls)
    }
    if (isOpen) {
      loadImages()
    }
  }, [isOpen])

  const breakpointColumnsObj = {
    default: 5,
    1270: 4,
    1100: 3,
    900: 2,
    600: 1
  }

  return (
    <>
      <Button
        variant='outline'
        m='5px'
        // position='absolute'
        // top='5px'
        // right='15px'
        onClick={() => {
          onOpen()
        }}
      >
        image from Media Library
      </Button>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContentStyled minW='50vw'>
          <ModalHeader>Images in Media Library</ModalHeader>
          <ModalCloseButton />
          <ModalBody my='50' mx='10' bg='#efefef5e' p='40px' borderRadius='5px'>
            {/* <Flex wrap='wrap'> */}
            <Masonry
              className='masonry'
              style={{
                display: 'flex'
              }}
              breakpointCols={breakpointColumnsObj}
              // columnClassName='my-masonry-grid_column'
            >
              {images &&
                images.map((image, i) => {
                  return (
                    <ImageWrapper
                      onClick={() => {
                        setImgURL(image)
                        onClose()
                      }}
                      key={i}
                      w='100px'
                      h='auto'
                      position='relative'
                    >
                      <img
                        style={{
                          objectFit: 'cover',
                          width: '100%',
                          height: 'auto'
                        }}
                        // quality='1'
                        src={image}
                        // layout='fill'
                        // objectFit='cover'
                        loading='eager'
                        // priority
                        alt={`image ${i} from media library`}
                      />
                    </ImageWrapper>
                  )
                })}
            </Masonry>
            {/* </Flex> */}
          </ModalBody>
        </ModalContentStyled>
      </Modal>
    </>
  )
}

export default ModalImages

const ImageWrapper = styled(Box)`
  border: 2px solid transparent;
  width: 100%;
  cursor: pointer;
  transition: border 0.2s linear, opacity 0.3s linear;
  :hover {
    opacity: 0.6;
    border: 2px solid black;
  }
`
const ModalContentStyled = styled(ModalContent)`
  background-color: #ffffffd1;
  backdrop-filter: blur(10px);
  overflow: hidden;
`
