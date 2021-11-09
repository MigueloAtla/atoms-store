import React, { useState, useEffect, useRef } from 'react'

// Firebase
import { uploadImages } from '@/firebase/client'

// Styles
import styled from 'styled-components'
import { TextAreaImageStyled } from './styles'

// Store
import useStore from '@/admin/store/store'
import { Box, Flex, Text } from '@chakra-ui/layout'
import { Spinner, Button } from '@chakra-ui/react'

import { DRAG_IMAGE_STATES } from './dragImageState'

const ImageUploader = () => {
  const [current, setCurrent] = useState(null)
  const [uploader, setUploader] = useState(false)
  const [droppedImage, setDroppedImage] = useState([])
  const [drag, setDrag] = useState(DRAG_IMAGE_STATES.NONE)
  const imgURL = useStore(state => state.imgURL)
  const setImgURL = useStore(state => state.setImgURL)
  const [upload, setUpload] = useState([])
  const [progress, setProgress] = useState([])
  const file = useRef([])

  useEffect(() => {
    if (upload) setUpload(false)
    return () => setImgURL('')
  }, [])

  const onProgress = snapshot => {
    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    setProgress(progress)
  }

  const handleDragEnter = e => {
    e.preventDefault()
    setDrag(DRAG_IMAGE_STATES.DRAG_OVER)
  }
  const handleDragLeave = e => {
    e.preventDefault()
    setDrag(DRAG_IMAGE_STATES.NONE)
  }
  const handleDrop = e => {
    e.preventDefault()
    setDrag(DRAG_IMAGE_STATES.NONE)
    const data_files = e.dataTransfer.files
    const data_arr = [...data_files]
    file.current = [...data_arr]
    const reader = []
    file.current.map(async (f, i) => {
      reader[i] = new FileReader()
      await reader[i].readAsDataURL(f)
      reader[i].addEventListener('load', event => {
        let uploaded_image = event.target.result
        setDroppedImage(s => [...s, uploaded_image])
      })
    })
  }

  return (
    <>
      {!uploader ? (
        <Button
          onClick={() => {
            setUploader(true)
          }}
        >
          Upload Images
        </Button>
      ) : (
        <Button
          onClick={() => {
            setUploader(false)
          }}
        >
          Close uploader
        </Button>
      )}

      {uploader && (
        <Box>
          <TextAreaImageStyled
            data-testid='dropimage'
            drag={drag}
            rows='2'
            value={imgURL}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={e => e.preventDefault()}
            onDragOver={e => e.preventDefault()}
            onDrag={e => e.preventDefault()}
            onDragStart={e => e.preventDefault()}
          />

          {droppedImage && drag !== DRAG_IMAGE_STATES.DRAG_OVER && (
            <Box
              h='300px'
              mt='40px'
              ml='40px'
              position='absolute'
              top='80px'
              display='flex'
            >
              {droppedImage.length > 0 && (
                <>
                  {droppedImage.map((img, i) => {
                    return (
                      <div key={i}>
                        <UploadedImage
                          draggable={false}
                          quality='1'
                          objectFit='cover'
                          layout='fill'
                          drag={drag}
                          src={img}
                          alt={`image from media library`}
                          loading='eager'
                          priority
                        />
                        <RemoveImageButton
                          onClick={() => {
                            setImgURL('')
                          }}
                        />

                        {upload.length > 0 &&
                          current === i &&
                          upload[i] === true && (
                            <>
                              <Text>
                                {'Uploading: ' + Math.trunc(progress[i]) + ' %'}
                              </Text>
                              <Flex
                                key={i}
                                justify='center'
                                align='center'
                                w='100%'
                                h='100%'
                              >
                                <Spinner size='xl' color='black' />
                              </Flex>
                            </>
                          )}
                      </div>
                    )
                  })}
                  <Button
                    onClick={async () => {
                      for (var i = 0; i < file.current.length; i++) {
                        var imageFile = file.current[i]
                        await uploadImages({
                          imageFile,
                          setProgress,
                          setUpload,
                          setCurrent,
                          i
                        })
                      }
                    }}
                  >
                    Upload
                  </Button>
                </>
              )}
            </Box>
          )}
        </Box>
      )}
    </>
  )
}

export default ImageUploader

const UploadedImage = styled.img`
  height: 290px;
  opacity: ${props => (props.drag === DRAG_IMAGE_STATES.DRAG_OVER ? 0.5 : 1)};
  transition: opacity 0.2s linear;
`
const RemoveImageButton = styled.div`
  cursor: pointer;
  width: 20px;
  height: 20px;
  background-color: grey;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  margin-left: -12px;
  margin-top: -7px;
  ::after {
    content: 'x';
    height: 27px;
  }
`
