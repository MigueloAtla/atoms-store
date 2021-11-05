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
  Box,
  Text
} from '@chakra-ui/react'
import Header from '@/admin/components/header'

import PageTransitionAnimation from '@/admin/atoms/pageTransitionAnimation'

import { useForm, useFieldArray } from 'react-hook-form'

export default function NewCollection () {
  const [fields, setFields] = useState([])

  const {
    register,
    control,
    handleSubmit: handleSubmitHook,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      fieldArr: [{ name: '', type: '', order: '', isRequired: false }]
    }
  })

  const { fields: fieldsControls, append, remove, move } = useFieldArray({
    control,
    name: 'fieldArr'
  })

  const onSubmit = data => {
    let formData = {}
    let key
    let new_entry = {}
    Object.entries(data).map((field, i) => {
      if (field[0] === 'collection-name') {
        key = field[1]
        formData[key] = { ...formData[key], name: key }
      }
      if (field[0] === 'fieldArr') {
        data['fieldArr'].map((f, i) => {
          const { name, order, ...entries } = f
          new_entry[name] = {
            ...entries,
            order: i
          }
        })
        let key = data['collection-name']
        formData[key] = { ...formData[key], schema: new_entry }
      }
    })
    createCollection(formData)
  }

  return (
    <Box minH='calc(100% - 50px)'>
      <Header back={true} title='Create a new collection type'>
        <Button
          type='button'
          onClick={() => {
            append({ name: '', type: '', order: '', isRequired: false })
          }}
        >
          Add field
        </Button>
        <Button form='create-collection' type='submit'>
          Create collection
        </Button>
      </Header>
      <PageTransitionAnimation>
        <Box m='20px'>
          <form id='create-collection' onSubmit={handleSubmitHook(onSubmit)}>
            <Input
              name='collection-name'
              placeholder='New collection name...'
              {...register('collection-name', {
                required: 'Write in this field, son of a bitch'
              })}
            />
            {errors['collection-name'] && errors['collection-name'].message}
            {fieldsControls.map((item, index) => {
              return (
                <Flex borderRadius='10px' mt='30px' key={item.id}>
                  <Flex bg='white' p='30' borderRadius='10px'>
                    <Flex minW='150' direction='column'>
                      <FormLabel>Name</FormLabel>
                      <Input
                        placeholder='Name of the field'
                        {...register(`fieldArr.${index}.name`, {
                          required: 'write sometheng'
                        })}
                      />
                      {errors.fieldArr?.[index]?.name &&
                        errors.fieldArr?.[index]?.name.message}
                    </Flex>
                    <FormLabel>Type</FormLabel>

                    <Flex minW='150' direction='column'>
                      <Select
                        name='type'
                        placeholder='Select type'
                        {...register(`fieldArr.${index}.type`, {
                          required: 'select a type'
                        })}
                      >
                        <option value='text'>text</option>
                        <option value='longtext'>long text</option>
                        <option value='richtext'>rich text</option>
                        <option value='image'>image</option>
                      </Select>
                      {errors.fieldArr?.[index]?.type && (
                        <Text>{errors.fieldArr?.[index]?.type.message}</Text>
                      )}
                    </Flex>

                    <FormLabel>Is required?</FormLabel>
                    <Select
                      w='90px'
                      name='isRequired'
                      placeholder='Is required?'
                      {...register(`fieldArr.${index}.isRequired`)}
                    >
                      <option value={true}>true</option>
                      <option value={false}>false</option>
                    </Select>
                  </Flex>
                  <Button type='button' onClick={() => remove(index)}>
                    Delete
                  </Button>
                </Flex>
              )
            })}
          </form>
        </Box>
      </PageTransitionAnimation>
    </Box>
  )
}
