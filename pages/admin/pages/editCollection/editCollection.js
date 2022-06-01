import { deleteFields } from '@/firebase/client'

// Components
import { Select, Flex, Button, Input, FormLabel, Text } from '@chakra-ui/react'
import * as Buttons from './buttons'

// HOC
import withPageHoc from '../pageHoc'

// hooks
import { useInitialHook } from './initialHook'
import { useFormHook } from './formHook'

// Utils
// import { capitalizeFirstLetter } from '@/admin/utils/utils'

const EditCollection = ({
  schema,
  type,
  fieldArr,
  fields, 
  remove, 
  register,
  handleSubmitHook,
  errors,
  onSubmit
}) => {

  return (
    <>
      {/* <EditCollectionForm schema={schema} type={type} /> */}
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
                    <option value='boolean'>boolean</option>
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
    </>
  )
}
export default withPageHoc({
  controller: useInitialHook,
  form: {
    hook: useFormHook,
  },
  header: {
    back: true,
    title: '::collection'
  },
  buttons: Buttons,
  events: {
    load: 'schema'
  },
  allowed_roles: ['admin']
})(EditCollection)
