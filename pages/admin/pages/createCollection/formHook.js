// react
import { useState } from 'react'

// firebase
import { createCollecitonWithRelations } from '@/firebase/client'

// hooks
import { useForm, useFieldArray, Controller } from 'react-hook-form'
// import { useHistory } from 'react-router-dom'

// store
import useStore from '@/admin/store/store'

export const useFormHook = ({}) => {
  const [table, setTable] = useState([false])
  const {collections, setRerender} = useStore(state => state)
  
  // const history = useHistory()
  
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

    createCollecitonWithRelations(formData, relation_entries)
    // try {
    //   createCollecitonWithRelations(formData, relation_entries)
    //   displayToast({
    //     title: 'Collection created successfully',
    //     description: 'Alright!'
    //   })
    //   setRerender(s => !s)
    //   history.goBack()
    // } catch (err) {
    //   displayToast({
    //     title: 'Something went wrong, please retry',
    //     description: 'Not alright...'
    //   })
    // }
  }

  return {
    collections,
    table,
    setTable,
    setRerender,
    register,
    control,
    handleSubmitHook,
    errors,
    fieldsControls,
    append,
    remove,
    move,
    Controller,
    onSubmit
  }
}