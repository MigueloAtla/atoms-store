import Post from './posts/[id]'

const post = {
  title: {
    value: 'Ramensito'
  },
  description: {
    value: 'Rico ramensito'
  }
}

export default function Ramen () {
  return <Post post={post} />
}