import React, { useState } from 'react'
import Img from 'react-cool-img'

export default function ImageWithPlaceholder ({ src, width, height }) {
  const [isLoading, setIsLoading] = useState(true)

  function onLoad () {
    setIsLoading(false)
  }

  return (
    <>
      {/* <img
        alt='ad-img'
        height={height}
        width={width}
        src={`https://via.placeholder.com/${width}x${height}/EFEFEF`}
        style={{ display: isLoading ? 'block' : 'none' }}
      /> */}
      {/* <div style={{ width, height, display: isLoading ? 'block' : 'none' }} /> */}
      <Img
        alt='ad-img'
        height={height}
        width={width}
        src={src}
        style={{
          opacity: isLoading ? 0 : 1,
          transition: 'opacity .2s ease-in'
        }}
        onLoad={onLoad}
      />
    </>
  )
}
