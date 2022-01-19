import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { addRelationToCollection, createCollection } from '@/firebase/client'

// Chackra UI Components
import {
  Select,
  Flex,
  FormLabel,
  Button,
  Input,
  Box,
  Text,
  Checkbox
} from '@chakra-ui/react'
import Header from '@/admin/components/header'

import PageTransitionAnimation from '@/admin/atoms/pageTransitionAnimation'

// Hooks
import useStore from '@/admin/store/store'
import { useDisplayToast } from '@/admin/hooks/toast'
import { useForm, useFieldArray, Controller } from 'react-hook-form'

export default function CreateCollection () {
  const collections = useStore(state => state.collections)
  const [table, setTable] = useState([false])
  const setRerender = useStore(state => state.setRerender)

  const history = useHistory()
  const displayToast = useDisplayToast()

  const {
    register,
    control,
    handleSubmit: handleSubmitHook,
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

  useEffect(() => {
    console.log('collections changed')
    console.log(collections)
  }, [collections])

  const onSubmit = data => {
    let formData = {}
    let key
    let new_entry = {}
    let junction = ''
    let relation_entries = []

    Object.entries(data).map((field, i) => {
      if (field[0] === 'collection-name') {
        key = field[1]
        formData[key] = { ...formData[key], name: key }
      }
      if (field[0] === 'fieldArr') {
        data['fieldArr'].map((f, i) => {
          const { name, order, relation, display, type, ...entries } = f
          if (relation !== undefined) {
            junction = `junction_${data['collection-name']}_${relation}`
            relation_entries.push({
              name: junction,
              display
            })
          }
          if (type !== 'relation') {
            new_entry[name] = {
              ...entries,
              type,
              order: i
            }
          }
        })
        let key = data['collection-name']
        formData[key] = {
          ...formData[key],
          schema: new_entry,
          relations: relation_entries,
          page: data.page
        }
      }
    })

    try {
      createCollection(formData)
      relation_entries.map(relation => {
        const spliceRelations = relation.name.split('_')
        let type2 = spliceRelations[2]
        addRelationToCollection(type2, relation)
      })
      displayToast({
        title: 'Collection created successfully',
        description: 'Alright!'
      })
      setRerender(s => !s)
      history.goBack()
    } catch (err) {
      displayToast({
        title: 'Something went wrong, please retry',
        description: 'Not alright...'
      })
    }
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
        <Button form='create-collection' type='submitb'>
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
            <Flex>
              <FormLabel>Is page?</FormLabel>
              <Checkbox
                name='page'
                placeholder='Is page?'
                {...register('page')}
              />
            </Flex>
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
                      {/* Controller select onchange check if value === relation: 
                      to display a new select filed with all the tables */}
                      <Controller
                        render={({ field }) => (
                          <Select
                            name='type'
                            placeholder='Select type'
                            {...field}
                            value={field.value}
                            onChange={e => {
                              let prevTable = Array.from(table)
                              if (e.target.value === 'relation') {
                                prevTable[index] = true
                                setTable(s => prevTable)
                                console.log('after settable line')
                              } else {
                                prevTable[index] = false
                                setTable(s => prevTable)
                              }
                              field.onChange(e)
                              console.log('after on change')
                            }}
                          >
                            <option value='text'>text</option>
                            <option value='longtext'>long text</option>
                            <option value='richtext'>rich text</option>
                            <option value='number'>number</option>
                            <option value='image'>image</option>
                            <option value='boolean'>boolean</option>
                            <option value='relation'>
                              relation (many-to-many)
                            </option>
                          </Select>
                        )}
                        control={control}
                        name={`fieldArr.${index}.type`}
                      />
                      {table[index] && (
                        <>
                          <Select
                            name='relation'
                            placeholder='Select type'
                            {...register(`fieldArr.${index}.relation`, {
                              required: 'select a existent collection type'
                            })}
                          >
                            {collections !== undefined &&
                              collections.length > 0 &&
                              collections.map((collection, i) => {
                                return (
                                  <option key={i} value={collection.name}>
                                    {collection.name}
                                  </option>
                                )
                              })}
                          </Select>
                          <Checkbox
                            name='display'
                            defaultValue={false}
                            {...register(`fieldArr.${index}.display`)}
                          >
                            Display this relation by default
                          </Checkbox>
                        </>
                      )}
                      {/* <Select
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
                        <option value='relation'>relation</option>
                      </Select> */}
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
