import React from 'react'
import { Select, Flex, Button, Input, FormLabel, Text } from '@chakra-ui/react'

import Header from '@/admin/components/header'
import { capitalizeFirstLetter } from '@/admin/utils/utils'

import { useForm, useFieldArray } from 'react-hook-form'
import { deleteFields, updateDocs } from '@/firebase/client'
import PageTransitionAnimation from '@/admin/atoms/pageTransitionAnimation'

const EditCollectionForm = ({ schema, type }) => {
  const fieldArr = Object.entries(schema[0].schema).map(s => {
    return {
      name: s[0],
      type: s[1].type,
      order: '',
      isRequired: s[1].isRequired
    }
  })
  const {
    register,
    handleSubmit: handleSubmitHook,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      fieldArr
    }
  })

  const { fields, remove, append } = useFieldArray({
    control,
    name: 'fieldArr'
  })

  const onSubmit = data => {
    console.log(data)
    let formData = {}
    let key
    let new_entry = {}
    Object.entries(data).map((field, i) => {
      if (field[0] === 'collection-name') {
        key = field[1]
        formData[key] = { ...formData[key], name: key }
      }
      data['fieldArr'].map((f, i) => {
        const { name, order, ...entries } = f
        new_entry[name] = {
          ...entries,
          order: i
        }
      })
      let key = data['collection-name']
      formData[key] = { ...formData[key], schema: new_entry }
    })
    console.log(schema)
    updateDocs(formData, schema, type)
  }

  return (
    <>
      <Header back title={`Collection schema: ${capitalizeFirstLetter(type)}`}>
        <Button
          type='button'
          onClick={() => {
            append({
              name: '',
              type: '',
              order: '',
              isRequired: false
            })
          }}
        >
          Add field
        </Button>
        <Button form='edit-collection' type='submit'>
          update
        </Button>
      </Header>
      <PageTransitionAnimation>
        <form id='edit-collection' onSubmit={handleSubmitHook(onSubmit)}>
          {schema && (
            <input
              type='hidden'
              value={schema[0].name}
              name='collection-name'
              {...register('collection-name')}
            />
          )}
          {fields.map((item, index) => {
            return (
              <Flex key={item.id}>
                <>
                  <Input
                    {...register(`fieldArr.${index}.name`, {
                      required: 'write sometheng'
                    })}
                  />
                  {errors.fieldArr?.[index]?.name && (
                    <Text>{errors.fieldArr?.[index]?.name.message}</Text>
                  )}
                  <Flex minW='150' direction='column'>
                    {fieldArr[index] ? (
                      <Text>{fieldArr[index]['type']}</Text>
                    ) : (
                      <Select
                        name='type'
                        placeholder='Select type'
                        {...register(`fieldArr.${index}.type`)}
                      >
                        <option value='text'>text</option>
                        <option value='longtext'>long text</option>
                        <option value='richtext'>rich text</option>
                        <option value='image'>image</option>
                      </Select>
                    )}
                  </Flex>

                  <FormLabel>Is required?</FormLabel>
                  <Flex minW='150' direction='column'>
                    <Select
                      w='90px'
                      name='isRequired'
                      placeholder='Select type'
                      {...register(`fieldArr.${index}.isRequired`, {
                        required: 'select an option'
                      })}
                    >
                      <option value={true}>true</option>
                      <option value={false}>false</option>
                    </Select>
                    {errors.fieldArr?.[index]?.isRequired && (
                      <Text>
                        {errors.fieldArr?.[index]?.isRequired.message}
                      </Text>
                    )}
                  </Flex>
                </>
                {fieldArr[index] ? (
                  <Button
                    onClick={() => {
                      deleteFields(fieldArr[index].name, type)
                    }}
                  >
                    Delete field from DB
                  </Button>
                ) : (
                  <Button type='button' onClick={() => remove(index)}>
                    Delete row
                  </Button>
                )}
              </Flex>
            )
          })}
        </form>
      </PageTransitionAnimation>
    </>
  )
}

export default EditCollectionForm
