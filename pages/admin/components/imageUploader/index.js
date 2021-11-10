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
  const [completed, setCompleted] = useState(false)
  const file = useRef([])

  useEffect(() => {
    if (upload) setUpload(false)
    return () => setImgURL('')
  }, [])

  const handleDragEnter = e => {
    e.preventDefault()
    setDrag(DRAG_IMAGE_STATES.DRAG_OVER)
  }
  const handleDragLeave = e => {
    e.preventDefault()
    setDrag(DRAG_IMAGE_STATES.NONE)
  }
  const handleDrop = async e => {
    e.preventDefault()
    setDrag(DRAG_IMAGE_STATES.NONE)
    const data_files = e.dataTransfer.files
    const data_arr = [...data_files]
    const arr = file.current
    file.current = [...arr, ...data_arr]

    readImage().then(p => {
      setDroppedImage(s => [...p])
    })
  }

  useEffect(() => {
    if (completed === true) {
      setDroppedImage([])
      file.current = []
    }
  }, [completed])
  useEffect(() => {
    if (droppedImage.length > 0) setCompleted(false)
  }, [droppedImage])

  const readImage = async () => {
    let reader = []
    const promises = file.current.map(async (f, i) => {
      return new Promise((resolve, reject) => {
        reader[i] = new FileReader()
        reader[i].readAsDataURL(f)
        reader[i].addEventListener('load', event => {
          let readimg = event.target.result
          resolve(readimg)
        })
      })
    })
    const images = await Promise.all(promises)
    return images
  }

  return (
    <>
      {!uploader ? (
        <Button
          onClick={() => {
            setUploader(true)
            if (completed === true) setCompleted(false)
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
          >
            {droppedImage && (
              <>
                <Box
                  m='40px'
                  top='80px'
                  display='flex'
                  flexWrap='wrap'
                  minH='250px'
                >
                  {droppedImage.length > 0 && !completed ? (
                    <>
                      {droppedImage.map((img, i) => {
                        return (
                          <Box key={i}>
                            <Flex>
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
                            </Flex>
                            {upload.length > 0 &&
                              current === i &&
                              upload[i] === true && (
                                <Flex>
                                  <Flex
                                    key={i}
                                    justify='center'
                                    align='center'
                                    h='100%'
                                    mr='20px'
                                  >
                                    <Spinner size='sm' color='black' />
                                  </Flex>

                                  <Text>
                                    {'Uploading: ' +
                                      Math.trunc(progress[i]) +
                                      ' %'}
                                  </Text>
                                </Flex>
                              )}
                          </Box>
                        )
                      })}
                    </>
                  ) : (
                    <Text>Drop images here</Text>
                  )}
                </Box>
                <Button
                  onClick={async () => {
                    for (var i = 0; i < file.current.length; i++) {
                      var imageFile = file.current[i]
                      await uploadImages({
                        imageFile,
                        setProgress,
                        setUpload,
                        setCurrent,
                        i,
                        setCompleted,
                        total: file.current.length - 1
                      })
                    }
                  }}
                >
                  Upload
                </Button>
              </>
            )}
          </TextAreaImageStyled>
        </Box>
      )}
    </>
  )
}

export default ImageUploader

const UploadedImage = styled.img`
  height: 200px;
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
