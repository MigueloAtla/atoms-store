import arg from 'arg'
import inquirer from 'inquirer'
import { generateAtom } from './main'

function parseArgumentsIntoOptions (rawArgs) {
  const args = arg(
    {
      '--name': String,
      '-n': '--name'
    },
    {
      argv: rawArgs.slice(2)
    }
  )
  return {
    name: args['--name'] || null
  }
}

async function promptForMissingOptions (options) {
  // const defaultTemplate = 'JavaScript'
  // if (options.skipPrompts) {
  //   return {
  //     ...options,
  //     template: options.template || defaultTemplate
  //   }
  // }

  const questions = []
  // if (!options.template) {
  //   questions.push({
  //     type: 'list',
  //     name: 'template',
  //     message: 'Please choose which project template to use',
  //     choices: ['JavaScript', 'TypeScript'],
  //     default: defaultTemplate
  //   })
  // }

  if (!options.name) {
    questions.push({
      // type: 'confirm',
      name: 'name',
      message: 'Name of the atom',
      default: null
    })
  }

  questions.push({
    type: 'list',
    name: 'type',
    message: 'Atom type',
    choices: ['Grid', 'Flex', 'Box'],
    default: 'Box'
  })

  const answers = await inquirer.prompt(questions)
  return {
    ...options,
    // template: options.template || answers.template,
    // git: options.git || answers.git,
    name: answers.name || options.name,
    type: answers.type
  }
}

export async function cli (args) {
  let options = parseArgumentsIntoOptions(args)
  options = await promptForMissingOptions(options)
  await generateAtom(options)
}
