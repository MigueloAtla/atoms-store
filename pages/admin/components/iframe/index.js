import React, { useState } from 'react'
import { createPortal } from 'react-dom'

function IFrame ({ children }) {
  const [ref, setRef] = useState()
  const container = ref?.contentWindow?.document?.body

  return (
    <iframe ref={setRef}>
      {container && createPortal(children, container)}
    </iframe>
  )
}

export default IFrame
