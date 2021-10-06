import React, { useState, useEffect } from 'react'
import Image from 'next/image'
// Hooks
import { useForm } from 'react-hook-form'

// Firebase
import { uploadImage } from '@/firebase/client'

// Styles
import styled from 'styled-components'
import { TextAreaImageStyled } from './styles'

// Store
import useStore from '@/admin/store/store'
import { Box, Flex } from '@chakra-ui/layout'
import { Spinner } from '@chakra-ui/spinner'

import ModalMediaLibrary from '@/admin/components/modals/modalMediaLibrary'

import { DRAG_IMAGE_STATES } from './dragImageState'

const TextAreaImage = ({ name, isRequired }) => {
  const [task, setTask] = useState(null)
  const [drag, setDrag] = useState(DRAG_IMAGE_STATES.NONE)
  const imgURL = useStore(state => state.imgURL)
  const setImgURL = useStore(state => state.setImgURL)
  const [upload, setUpload] = useState(false)
  const {
    register,
    formState: { errors }
  } = useForm()

  useEffect(() => {
    return () => setImgURL('')
  }, [])

  useEffect(() => {
    if (task) {
      setUpload(true)
      let onProgress = snapshot => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        // setProgress(progress)
        console.log('Upload is ' + progress + '% done')
        if (progress === 100)
          setTimeout(() => {
            setUpload(false)
          }, 200)
      }
      let onError = () => {}
      let onComplete = () => {
        console.log('complete')
        task.snapshot.ref.getDownloadURL().then(setImgURL)
      }
      task.on('state_changed', onProgress, onError, onComplete)
    }
  }, [task])

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
      <TextAreaImageStyled
        data-testid='dropimage'
        drag={drag}
        rows='2'
        name={name}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        {...register(name, {
          required: isRequired && 'Write in this field, son of a bitch'
        })}
      />
      {isRequired && errors[name] && errors[name].message}
      {imgURL && (
        <Box w='500px' h='300px' position='relative'>
          <UploadedImage
            quality='1'
            objectFit='cover'
            layout='fill'
            drag={drag}
            src={imgURL}
            alt={`image from media library`}
            loading='eager'
            priority
          />
          {upload && (
            <Flex justify='center' align='center' w='100%' h='100%'>
              <Spinner size='xl' />
            </Flex>
          )}
          <ModalMediaLibrary setImgURL={setImgURL} />
        </Box>
      )}
    </>
  )
}

export default TextAreaImage

const UploadedImage = styled(Image)`
  opacity: ${props => (props.drag === DRAG_IMAGE_STATES.DRAG_OVER ? 0.5 : 1)};
  transition: opacity 0.2s linear;
`
