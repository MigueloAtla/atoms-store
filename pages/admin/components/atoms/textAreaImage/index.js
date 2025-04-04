import React, { useState, useEffect } from 'react'
import Image from 'next/image'
// Hooks
import { useForm, useFormContext } from 'react-hook-form'

// Firebase
import { uploadImage } from '@/firebase/client'

// Styles
import styled from 'styled-components'
import { TextAreaImageStyled } from './styles'

// Store
import useStore from '@/admin/store/store'
import { Box, Flex, Text } from '@chakra-ui/layout'
import { Spinner } from '@chakra-ui/spinner'

// Components
// import ImageWithPlaceholder from '@/admin/components/imageWithPlaceholder'

import ModalMediaLibrary from '@/admin/components/modals/modalMediaLibrary'

import { DRAG_IMAGE_STATES } from './dragImageState'

const TextAreaImage = ({ name, isRequired }) => {
  const [task, setTask] = useState(null)
  const [drag, setDrag] = useState(DRAG_IMAGE_STATES.NONE)
  const imgURL = useStore(state => state.imgURL)
  const setImgURL = useStore(state => state.setImgURL)
  const [upload, setUpload] = useState(false)
  const [progress, setProgress] = useState(0)

  const { register, errors, setValue } = useFormContext()

  useEffect(() => {
    if (upload) setUpload(false)
    return () => setImgURL('')
  }, [])

  useEffect(() => {
    if (task) {
      setUpload(true)
      let onProgress = snapshot => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setProgress(progress)
        if (progress === 100)
          setTimeout(() => {
            setUpload(false)
          }, 200)
      }
      let onError = () => {}
      let onComplete = () => {
        task.snapshot.ref.getDownloadURL().then(setImgURL)
      }
      task.on('state_changed', onProgress, onError, onComplete)
    }
  }, [task])

  useEffect(() => {
    setValue(name, imgURL)
  }, [imgURL])

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
    const file = e.dataTransfer.files[0]
    const task = uploadImage(file)
    setTask(task)
  }

  return (
    <>
      <Box position='absolute' top='5px' right='15px'>
        <ModalMediaLibrary setImgURL={setImgURL} />
      </Box>
      <Box>
        <TextAreaImageStyled bg={ drag === DRAG_IMAGE_STATES.DRAG_OVER ? 'background' : 'secondary_bg'}

          data-testid='dropimage'
          drag={drag}
          rows='2'
          // name={name}
          value={imgURL}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onDragEnd={e => e.preventDefault()}
          onDragOver={e => e.preventDefault()}
          onDrag={e => e.preventDefault()}
          onDragStart={e => e.preventDefault()}
          // {...register(name, {
          //   required: isRequired && 'Write in this field, son of a bitch'
          // })}
        />

        <input
          type='hidden'
          name={name}
          value={imgURL}
          {...register(name, {
            required: isRequired && 'Select an image, son of a bitch'
          })}
        />
        {isRequired && errors[name] && errors[name].message}
        {imgURL && drag !== DRAG_IMAGE_STATES.DRAG_OVER && (
          <Box
            h='300px'
            mt='40px'
            ml='40px'
            position='absolute'
            top='80px'
            display='flex'
          >
            <UploadedImage
              draggable={false}
              quality='1'
              objectFit='cover'
              layout='fill'
              drag={drag}
              src={imgURL}
              alt={`image from media library`}
              loading='eager'
              priority
            />
            <RemoveImageButton
              onClick={() => {
                setImgURL('')
              }}
            />
            {upload && (
              <Flex justify='center' align='center' w='100%' h='100%'>
                <Spinner size='xl' color='white' />
              </Flex>
            )}
          </Box>
        )}
        {upload && <Text>{'Uploading: ' + Math.trunc(progress) + ' %'}</Text>}
      </Box>
    </>
  )
}

export default TextAreaImage

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
