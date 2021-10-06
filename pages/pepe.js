import { getCollection } from '@/firebase/client'
import React, { useEffect } from 'react'

export default function Pepe () {
  // useEffect(() => {
  //   const getPosts = async () => {
  //     const posts_res = await getCollection('posts')
  //     // const posts = await posts_res
  //     // console.log(posts_res)
  //     return posts_res
  //   }
  //   // getCollection('posts').then(collections => {
  //   //   console.log(collections)
  //   // })
  //   const posts = getPosts().then(r => console.log(r[0].id))
  //   // console.log(posts)
  // }, [])

  return (
    <div>
      <h1>PEPE page</h1>
    </div>
  )
}
