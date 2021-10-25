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
            <Flex wrap='wrap'>
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
                      h='100px'
                      position='relative'
                    >
                      <Image
                        quality='1'
                        src={image}
                        layout='fill'
                        objectFit='cover'
                        loading='eager'
                        priority
                        alt={`image ${i} from media library`}
                      />
                    </ImageWrapper>
                  )
                })}
            </Flex>
          </ModalBody>
        </ModalContentStyled>
      </Modal>
    </>
  )
}

export default ModalImages

const ImageWrapper = styled(Box)`
  border: 2px solid transparent;
  margin: 10px;
  padding: 5px;
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
