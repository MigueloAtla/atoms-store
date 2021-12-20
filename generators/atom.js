// const fs = require('fs')

// const atom = 'generated'

// const capitalizeFirstLetter = string => {
//   return string.charAt(0).toUpperCase() + string.slice(1)
// }

// if (!fs.existsSync(`./components/atoms/${atom}`)) {
//   fs.mkdir(`./components/atoms/${atom}`, { recursive: true }, function (err) {
//     if (err) {
//       console.log(err)
//     } else {
//       console.log(
//         `New directory: ./components/atoms/${atom} successfully created.`
//       )

//       if (!fs.existsSync(`./components/atoms/${atom}/index.js`)) {
//         fs.writeFile(
//           `./components/atoms/${atom}/index.js`,
//           `import React from 'react'
// const ${capitalizeFirstLetter(atom)} = () => {
//   return (
//     <p>${atom}</p>
//   )
// }
// export default ${capitalizeFirstLetter(atom)}`,
//           { recursive: true },
//           () => {
//             console.log(
//               `New file: ./components/atoms/${atom}/index.js created.`
//             )
//           }
//         )
//       }

//       if (!fs.existsSync(`./components/atoms/${atom}/styles.js`)) {
//         fs.writeFile(
//           `./components/atoms/${atom}/styles.js`,
//           `import styled from 'styled-components'
// import {Box} from 'rebass/styled-components'

// export const ${capitalizeFirstLetter(atom)}Styled = styled(Box)\`
//   border: 1px solid black;
// \`
//           `,
//           { recursive: true },
//           () => {
//             console.log(
//               `New file: ./components/atoms/${atom}/styles.js created.`
//             )
//           }
//         )
//       }
//       if (!fs.existsSync(`./components/atoms/${atom}/test.js`)) {
//         fs.writeFile(
//           `./components/atoms/${atom}/test.js`,
//           `import React from 'react'
// import { render, screen } from '@testing-library/react'
// import '@testing-library/jest-dom/extend-expect'
// import ${capitalizeFirstLetter(atom)} from './'
// describe('${capitalizeFirstLetter(atom)}', () => {
//   it('renders and expect nothing', () => {
//     render(<${capitalizeFirstLetter(atom)} />)
//     expect(true).toHaveTextContent(true)
//   })
// })
// `,
//           { recursive: true },
//           () => {
//             console.log(`New file: ./components/atoms/${atom}/test.js created.`)
//           }
//         )
//       }
//     }
//   })
// }
