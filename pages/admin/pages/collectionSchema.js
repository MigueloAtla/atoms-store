import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// components
import Header from '../components/header'
import { Select, Flex, Button, Input, Spacer, Box } from '@chakra-ui/react'
import PageTransitionAnimation from '@/admin/atoms/pageTransitionAnimation'

// State
// import useStore from '@/admin/store/store'
import {
  getFullSchemaByType,
  updateDocs,
  updateSchema,
  deleteFields
} from '@/firebase/client'
// Utils
import { capitalizeFirstLetter } from '@/admin/utils/utils'
import { Label } from '../styles'

const CollectionSchema = () => {
  const [fields, setFields] = useState([])
  const { type } = useParams()
  const [schema, setSchema] = useState(null)
  const [indexes, setIndexes] = useState([])

  useEffect(() => {
    getFullSchemaByType(type).then(data => {
      setSchema(data)
    })
  }, [])

  const handleSubmit = e => {
    e.preventDefault()
    const formData = {}
    let t = {}
    let value = ''
    let key
    let order = 0
    console.log(e.currentTarget)
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
    updateDocs(formData, schema, type)
    // updateSchema(formData)
  }

  const getField = ({ name, type, isRequired }) => {
    return (
      <>
        <Label>Name:</Label>
        <Input
          name='collection-field-name'
          placeholder='name'
          defaultValue={name}
        />
        <Flex mt='50'>
          <Flex flexDirection='column' mr='50'>
            <Label>Type:</Label>
            <Select name='type' placeholder='Select type' defaultValue={type}>
              <option value='text'>text</option>
              <option value='longtext'>long text</option>
              <option value='richtext'>rich text</option>
              <option value='image'>image</option>
            </Select>
          </Flex>
          <Flex flexDirection='column'>
            <Label>Is required?:</Label>
            <Select
              name='required'
              placeholder='Is required?'
              defaultValue={isRequired}
            >
              <option value={true}>true</option>
              <option value={false}>false</option>
            </Select>
          </Flex>
        </Flex>
      </>
    )
  }

  const newField = i => {
    return {
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
  }

  const addField = () => {
    setIndexes(s => [...s, Math.random()])
    setFields(s => [...s, newField(fields.length)])
  }

  const removeField = i => {
    let tempfields = fields
    let rest = [...indexes]
    tempfields = tempfields.filter((_, index) => index !== i)
    rest = rest.filter((_, index) => index !== i)
    setFields(s => [...tempfields])
    setIndexes(s => [...rest])
  }

  return (
    <>
      <Header back title={`Collection schema: ${capitalizeFirstLetter(type)}`}>
        <Button onClick={addField}>Add Field</Button>
        <Button form='update-collection' type='submit'>
          Update
        </Button>
      </Header>

      <PageTransitionAnimation>
        <form onSubmit={handleSubmit} id='update-collection'>
          {schema && (
            <input
              type='hidden'
              value={schema[0].name}
              name='collection-name'
            />
          )}
          {schema &&
            Object.entries(schema[0].schema).map((s, i) => {
              return (
                <Box key={i}>
                  <Flex
                    direction='column'
                    bg='white'
                    borderRadius='10px'
                    p='20px'
                    mt='30px'
                    position='relative'
                    key={i}
                  >
                    {getField({
                      name: s[0],
                      type: s[1].type,
                      isRequired: s[1].isRequired
                    })}
                    <Button
                      onClick={() => {
                        deleteFields(s[0], type)
                      }}
                    >
                      delete
                    </Button>
                  </Flex>
                </Box>
              )
            })}
          {fields.length > 0 &&
            fields.map((field, i) => {
              return (
                <Box key={indexes[i]}>
                  <Flex
                    direction='column'
                    bg='white'
                    borderRadius='10px'
                    p='20px'
                    mt='30px'
                    position='relative'
                  >
                    {field.name}
                    <Spacer />
                    <Flex>
                      {field.type}
                      {field.required}
                    </Flex>
                    <Button
                      onClick={() => {
                        removeField(i)
                      }}
                    >
                      remove
                    </Button>
                  </Flex>
                </Box>
              )
            })}
        </form>
      </PageTransitionAnimation>
    </>
  )
}
export default CollectionSchema
