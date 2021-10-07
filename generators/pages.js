;(async function () {
  const fs = require('fs')
  const firebase = require('firebase')
  require('dotenv').config()
  require('firebase/firestore')
  const firebaseConfig = {
    projectId: process.env.ANALYTICS_ID_PROJECT_ID
  }

  const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  firebase.initializeApp(firebaseConfig)

  let db = firebase.firestore()

  const snapshot = await db.collection('collectionList').get()
  let collections = []
  snapshot.forEach(doc => {
    const result = doc.data()
    collections = Object.keys(result)
  })

  if (collections.length > 0) {
    collections.map(collection => {
      if (!fs.existsSync(`./pages/${collection}`)) {
        fs.mkdir(`./pages/${collection}`, { recursive: true }, function (err) {
          if (err) {
            console.log(err)
          } else {
            console.log(
              `New directory: ./pages/${collection} successfully created.`
            )

            if (!fs.existsSync(`./pages/${collection}/[id].js`)) {
              fs.writeFile(
                `./pages/${collection}/[id].js`,
                `
                import React from 'react'
                import { getCollection, getDocByID } from '@/firebase/client'
                
                import { withTheme, PostWrapperStyled } from '@/theme'
                
                import styled from 'styled-components'
                import { LayoutStyled } from '@/layouts/postLayout'
                
                export default function ${capitalizeFirstLetter(
                  collection
                ).slice(0, -1)} ({ ${collection.slice(0, -1)} }) {
                    const { Title, Description, Image, Content } = withTheme(${collection.slice(
                      0,
                      -1
                    )})
                      
                      return (
                        <>
                        <h1>${capitalizeFirstLetter(collection)}</h1>
                        </>
                        )
                      }
                      
                      export async function getStaticProps ({ params: { id } }) {
                        const ${collection.slice(
                          0,
                          -1
                        )} = await getDocByID('${collection.slice(0, -1)}', id)
                          
                          return {
                            props: {
                              ${collection.slice(0, -1)}
                            }
                          }
                        }
                        
                        export async function getStaticPaths () {
                          const ${collection} = await getCollection('${collection}')
                          return {
                            paths:
                            ${collection} &&
                            ${collection}.map(el => ({
                              params: { id: String(el.id) }
                            })),
                            fallback: false
                          }
                        }
                        
                        
                        `,
                { recursive: true },
                () => {
                  console.log(
                    `Page component: ${collection}/[id].js successfully created.`
                  )
                }
              )
            } else {
              console.log(
                `Page component: ${collection}/[id].js already exists. Nothing created`
              )
            }
          }
        })
      } else {
        console.log(
          `Directory: ./pages/${collection} already exists. Nothing created.`
        )
      }
    })
  }

  setTimeout(() => {
    process.exit()
  }, 1000)
})()
