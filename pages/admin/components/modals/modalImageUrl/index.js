import React, { useEffect, useState } from 'react'

import {
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  useDisclosure
} from '@chakra-ui/react'

import { getImages } from '@/firebase/client'
import styled from 'styled-components'

const ModalImageUrl = ({ setImgURL }) => {
  const [images, setImages] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [value, setValue] = React.useState('')
  const handleChange = event => setValue(event.target.value)

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
        onClick={() => {
          onOpen()
        }}
      >
        image from URL
      </Button>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContentStyled minW='50vw'>
          <ModalHeader>Image from external Url</ModalHeader>
          <ModalCloseButton />
          <ModalBody my='50' mx='10'>
            <Flex justify='space-between'>
              <Input
                w='calc(90% - 100px)'
                data-testid='imageUrl'
                variant='flushed'
                placeholder='Paste an image url'
                onChange={handleChange}
              />
              <Button
                onClick={() => {
                  if (value) setImgURL(value)
                  onClose()
                }}
              >
                Add image
              </Button>
            </Flex>
          </ModalBody>
        </ModalContentStyled>
      </Modal>
    </>
  )
}

export default ModalImageUrl

const ModalContentStyled = styled(ModalContent)`
  background-color: #ffffffd1;
  backdrop-filter: blur(10px);
  overflow: hidden;
`
