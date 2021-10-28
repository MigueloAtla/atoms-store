import React, { useState } from 'react'

import { createCollection } from '@/firebase/client'

// Chackra UI Components
import {
  Select,
  Flex,
  FormLabel,
  Button,
  Input,
  Spacer,
  Box
} from '@chakra-ui/react'
import Header from '@/admin/components/header'

import PageTransitionAnimation from '@/admin/atoms/pageTransitionAnimation'

export default function NewCollection () {
  const [fields, setFields] = useState([])

  const handleSubmit = e => {
    e.preventDefault()
    const formData = {}
    let t = {}
    let value = ''
    let key
    let order = 0
    Array.from(e.currentTarget).map((field, i) => {
      if (!field.name) return

      if (field.name === 'collection-name') {
        key = field.value
        formData[key] = { name: field.value }
      }

      if (field.name === 'collection-field-name') {
        value = field.value
      }
      if (field.name === 'type') {
        t[value] = {
          type: field.value
        }
      }
      if (field.name === 'required') {
        t[value] = {
          ...t[value],
          isRequired: field.value === 'true',
          order
        }
        formData[key]['schema'] = t
        value = ''
        order++
      }
    })
    // activate this
    createCollection(formData)
  }

  const newField = {
    name: <Input name='collection-field-name' placeholder='name' />,
    type: (
      <Select name='type' placeholder='Select type'>
        <option value='text'>text</option>
        <option value='longtext'>long text</option>
        <option value='richtext'>rich text</option>
        <option value='image'>image</option>
      </Select>
    ),
    required: (
      <Select name='required' placeholder='Is required?'>
        <option value={true}>true</option>
        <option value={false}>false</option>
      </Select>
    )
  }

  const addField = () => {
    setFields(s => [...s, newField])
  }

  return (
    <Box minH='calc(100% - 50px)'>
      <Header back={true} title='Create a new collection type'>
        <Button onClick={addField}>Add Field</Button>
        <Button form='new-collection' type='submit'>
          Create collection
        </Button>
      </Header>
      <PageTransitionAnimation>
        <Box m='20px'>
          <form onSubmit={handleSubmit} id='new-collection'>
            <Flex direction='column'>
              <Box
                bg='white'
                borderRadius='10px'
                p='20px'
                mt='30px'
                position='relative'
              >
                <FormLabel>Collection Name</FormLabel>
                <Flex>
                  <Input
                    name='collection-name'
                    placeholder='New collection name...'
                  />
                </Flex>
              </Box>
              {fields.length > 0 &&
                fields.map((field, i) => {
                  return (
                    <Flex
                      direction='column'
                      bg='white'
                      borderRadius='10px'
                      p='20px'
                      mt='30px'
                      position='relative'
                      key={i}
                      height='200'
                    >
                      {field.name}
                      <Spacer />
                      {field.type}
                      <Spacer />
                      {field.required}
                    </Flex>
                  )
                })}
            </Flex>
          </form>
        </Box>
      </PageTransitionAnimation>
    </Box>
  )
}
