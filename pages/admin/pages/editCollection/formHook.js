// firebase
import { updateDocs } from '@/firebase/client'
import { useEffect, useMemo, useState } from 'react'

// hooks
import { useForm, useFieldArray } from 'react-hook-form'

export const useFormHook = ({
  schema
}) => {
  const [fieldArr, setFieldArr] = useState([])
  useEffect(() => {
    if(schema) {
      setFieldArr(() => Object.entries(schema[0].schema).map(s => {
        return {
          name: s[0],
          type: s[1].type,
          order: '',
          isRequired: s[1].isRequired
        }
      }))
    }
  }, [schema])
  
  useEffect(() => {
    console.log('fieldArr', fieldArr)
    if(fieldArr) {
      reset({
        fieldArr
      })
    }

  }, [fieldArr])
  
  const {
      register,
      handleSubmit: handleSubmitHook,
      control,
      reset,
      formState: { errors }
    } = useForm({
      defaultValues: useMemo(() => {
        return fieldArr
      }, [fieldArr])
  })

  const { fields, remove, append } = useFieldArray({
    control,
    name: 'fieldArr'
  })

  const onSubmit = data => {
    let formData = {}
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
    updateDocs(formData, schema, type)
  }

  return {
    fieldArr,
    fields, 
    remove, 
    append,
    register,
    handleSubmitHook,
    control,
    reset,
    errors,
    onSubmit
  }
}