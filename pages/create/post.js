import { useState } from 'react'
import { addPost } from 'firebase/client'

const CreatePost = () => {
  const [message, setMessage] = useState('')

  const handleChange = e => {
    const { value } = e.target
    setMessage(value)
  }

  const handleSubmit = e => {
    e.preventDefault()
    addPost({
      content: message
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={handleChange}
          placeholder='write the post content'
        />
        <button disabled={message.length === 0}>Create</button>
      </form>
    </>
  )
}

export default CreatePost
