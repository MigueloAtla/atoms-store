// ;(async function () {
//   const fs = require('fs')
//   const firebase = require('firebase')
//   require('dotenv').config()
//   require('firebase/firestore')
//   const firebaseConfig = {
//     projectId: process.env.ANALYTICS_ID_PROJECT_ID
//   }

//   const capitalizeFirstLetter = string => {
//     return string.charAt(0).toUpperCase() + string.slice(1)
//   }

//   firebase.initializeApp(firebaseConfig)

//   let db = firebase.firestore()

//   const snapshot = await db.collection('collectionList').get()
//   let collections = []
//   let result
//   snapshot.forEach(doc => {
//     result = doc.data()
//     collections = Object.keys(result)
//   })

//   collectionsData = Object.keys(result).map(key => {
//     return {
//       name: key,
//       page: result[key].page
//     }
//   })

//   if (collections.length > 0) {
//     collections.map(async collection => {
//       let page = result[collection].page

//       if (page) {
//         let schema = Object.keys(result[collection].schema)

//         let capitalizedSchema = schema.map(s => capitalizeFirstLetter(s))

//         let comps = capitalizedSchema.map(comp => {
//           if (comp === 'Content') {
//             return `{${comp}()}`
//           }
//           return `<${comp} />`
//         })

//         if (!fs.existsSync(`./pages/${collection}`)) {
//           fs.mkdir(`./pages/${collection}`, { recursive: true }, function (
//             err
//           ) {
//             if (err) {
//               console.log(err)
//             } else {
//               console.log(
//                 `New directory: ./pages/${collection} successfully created.`
//               )

//               if (!fs.existsSync(`./pages/${collection}/[id].js`)) {
//                 fs.writeFile(
//                   `./pages/${collection}/[id].js`,
//                   `
//                 import React from 'react'
//                 import { getCollection, getDocByID } from '@/firebase/client'

//                 import { GlobalStyles, getComponents } from '@/theme'

//                 import { LayoutStyled } from '@/layouts/postLayout'
//                 import { Column, Row, AutoColumns } from '@/layouts/index'

//                 export default function ${capitalizeFirstLetter(
//                   collection
//                 ).slice(0, -1)} ({ ${collection.slice(0, -1)} }) {
//                     const {${capitalizedSchema.join(
//                       ', '
//                     )}} = getComponents(${collection.slice(0, -1)})

//                       return (
//                         <LayoutStyled width='100%'>
//                           <GlobalStyles />
//                           <Column center>
//                           ${comps.join(' ')}
//                           </Column>
//                         </LayoutStyled>
//                         )
//                       }

//                       export async function getStaticProps ({ params: { id } }) {
//                         const ${collection.slice(
//                           0,
//                           -1
//                         )} = await getDocByID('${collection}', id)

//                           return {
//                             props: {
//                               ${collection.slice(0, -1)}
//                             }
//                           }
//                         }

//                         export async function getStaticPaths () {
//                           const ${collection} = await getCollection('${collection}')
//                           return {
//                             paths:
//                             ${collection} &&
//                             ${collection}.map(el => ({
//                               params: { id: String(el.id) }
//                             })),
//                             fallback: false
//                           }
//                         }

//                         `,
//                   { recursive: true },
//                   () => {
//                     console.log(
//                       `Page component: ${collection}/[id].js successfully created.`
//                     )
//                     // add page components to preview
//                     fs.appendFileSync(
//                       './pages/admin/previews.js',
//                       `export { default as ${capitalizeFirstLetter(
//                         collection
//                       ).slice(0, -1)} } from '../../pages/${collection}/[id]'\n`
//                     )
//                   }
//                 )
//               } else {
//                 console.log(
//                   `Page component: ${collection}/[id].js already exists. Nothing created`
//                 )
//               }
//             }
//           })
//         } else {
//           console.log(
//             `Directory: ./pages/${collection} already exists. Nothing created.`
//           )
//         }
//       }
//     })
//   }

//   setTimeout(() => {
//     process.exit()
//   }, 1000)
// })()
