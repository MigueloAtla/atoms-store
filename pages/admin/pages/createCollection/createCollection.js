// components
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
import * as Buttons from './buttons'

// HOC
import withPageHoc from '../pageHoc'

// Hooks
import { useInitialHook } from './initialHook'
import { useFormHook } from './formHook'

const CreateCollection = ({ 
  collections, 
  table, 
  setTable, 
  Controller, 
  handleSubmitHook, 
  onSubmit, 
  register,
  control,
  errors,
  fieldsControls,
  remove
}) => {

  return (
    <Box minH='calc(100% - 50px)'>
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
    </Box>
  )
}

export default withPageHoc({
  controller: useInitialHook,
  form: {
    hook: useFormHook,
  },
  header: {
    back: true,
    title: 'New Collection'
  },
  events: {
    hook: () => {},
    update: null,
    collection_created: {
      msg: 'Collection created successfully',
      description: 'Alright!'
    }
  },
  buttons: Buttons,
  allowed_roles: ['admin']
})(CreateCollection)
