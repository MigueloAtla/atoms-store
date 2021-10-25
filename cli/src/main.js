import chalk from 'chalk'
import {
  atomIndexTemplate,
  atomStylesTemplate,
  atomTestTemplate
} from '../templates/atom'
import fs from 'fs'
// import ncp from 'ncp'
// import path from 'path'
// import { promisify } from 'util'

// const access = promisify(fs.access)
// const copy = promisify(ncp)

const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// async function copyTemplateFiles (options) {
//   return copy(options.templateDirectory, options.targetDirectory, {
//     clobber: false
//   })
// }

export async function generateAtom (options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd()
  }

  if (options.name === null) {
    console.log('%s No atom name given, exiting.', chalk.yellow.bold('FAILED'))
    return true
  }
  if (!fs.existsSync(`./components/atoms/${options.name}`)) {
    const path = `./components/atoms/${options.name}`

    fs.mkdir(
      `./components/atoms/${options.name}`,
      { recursive: true },
      function (err) {
        if (err) {
          console.log(err)
        } else {
          console.log(
            `%s New directory: ${path} successfully created.`,
            chalk.green.bold('DONE')
          )

          if (!fs.existsSync(`${path}/index.js`)) {
            fs.writeFile(
              `${path}/index.js`,
              atomIndexTemplate(options.name),
              { recursive: true },
              () => {
                console.log(
                  `%s New file: ${path}/index.js successfully created.`,
                  chalk.green.bold('DONE')
                )
              }
            )
          }

          if (!fs.existsSync(`${path}/styles.js`)) {
            fs.writeFile(
              `${path}/styles.js`,
              atomStylesTemplate(options.name, options.type),
              { recursive: true },
              () => {
                console.log(
                  `%s New directory: ${path}/styles.js successfully created.`,
                  chalk.green.bold('DONE')
                )
              }
            )
          }
          if (!fs.existsSync(`${path}/test.js`)) {
            fs.writeFile(
              `${path}/test.js`,
              atomTestTemplate(options.name),
              { recursive: true },
              () => {
                console.log(
                  `%s New directory: ${path}/test.js successfully created.`,
                  chalk.green.bold('DONE')
                )
              }
            )
          }
        }
      }
    )

    const index = './components/atoms/index.js'

    if (!fs.existsSync(index)) {
      fs.writeFileSync(index, '\nexport {}', { recursive: true }, () => {
        console.log(
          `%s New file: ${index} successfully created.`,
          chalk.green.bold('DONE')
        )
      })
    }

    // Prepend import into atoms/index.js

    // const readedfile = fs.readFileSync(index, 'utf8')
    // var withoutLastLine = readedfile
    //   .split('\n')
    //   .slice(0, -1)
    //   .join('\n')

    // fs.writeFileSync(index, withoutLastLine, { recursive: true }, () => {
    //   console.log(
    //     `%s New file: ${index} successfully created.`,
    //     chalk.green.bold('DONE')
    //   )
    // })

    // fs.appendFileSync(index, `${capitalizeFirstLetter(options.name)}\n}`)

    const data = fs.readFileSync(index)
    const fd = fs.openSync(index, 'w+')
    const insert = Buffer.from(
      `import ${capitalizeFirstLetter(options.name)} from './${
        options.name
      }' \n`
    )
    fs.writeSync(fd, insert, 0, insert.length, 0)
    fs.writeSync(fd, data, 0, data.length, insert.length)

    fs.close(fd, err => {
      if (err) throw err
    })

    fs.readFile(index, 'utf8', function (err, data) {
      if (err) {
        return console.log(err)
      }
      var result = data.replace(
        /}/g,
        `, ${capitalizeFirstLetter(options.name)} }`
      )
      var result_cleaned = result.replace(/{,/g, `{`)

      fs.writeFile(index, result_cleaned, 'utf8', function (err) {
        if (err) return console.log(err)
      })
    })
  }

  // const currentFileUrl = import.meta.url
  // const templateDir = path.resolve(
  //   new URL(currentFileUrl).pathname,
  //   '../../templates',
  //   options.template.toLowerCase()
  // )
  // options.templateDirectory = templateDir

  // try {
  //   await access(templateDir, fs.constants.R_OK)
  // } catch (err) {
  //   console.error('%s Invalid template name', chalk.red.bold('ERROR'))
  //   process.exit(1)
  // }

  // console.log('Copy project files')
  // await copyTemplateFiles(options)

  console.log('%s Atom created', chalk.green.bold('DONE'))
  return true
}
