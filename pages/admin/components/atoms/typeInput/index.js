import React from 'react'
import { useFormContext } from 'react-hook-form'

// Components
import TipTap from '@/admin/components/editor'
import TextAreaImage from '@/admin/components/atoms/textAreaImage'
import { TextInputStyled, TextAreaStyled } from '@/admin/atoms/textInput/styles'
import { Input, Switch } from '@chakra-ui/react'

const TypeInput = ({ obj, name, onSubmit, editorContent, haveEditor }) => {
  const { register, errors } = useFormContext()
  let { type, value, isRequired } = obj
  switch (type) {
    case 'longtext':
      return (
        <>
          <TextAreaStyled
            rows='6'
            name={name}
            defaultValue={value}
            {...register(name, {
              required: isRequired && 'Write in this field, son of a bitch'
            })}
          />
          {isRequired && errors[name] && errors[name].message}
        </>
      )
    case 'text':
      return (
        <>
          <TextInputStyled
            defaultValue={value}
            {...register(name, {
              required: isRequired && 'Write in this field, son of a bitch'
            })}
          />
          {isRequired && errors[name] && errors[name].message}
        </>
      )
    case 'image':
      return (
        <TextAreaImage
          name={name}
          isRequired={isRequired}
          register={register}
          errors={errors}
        />
      )
    case 'richtext': {
      haveEditor.current = true
      return (
        <TipTap
          value={value}
          onSubmit={onSubmit}
          editorContent={editorContent}
        />
      )
    }
    case 'boolean':
      return <Switch defaultChecked={value} {...register(name)} />
    default:
      return (
        <>
          <Input
            name={name}
            defaultValue={value}
            {...register(name, {
              required: isRequired && 'Write in this field, son of a bitch'
            })}
          />
          {isRequired && errors[name] && errors[name].message}
        </>
      )
  }
}

export default TypeInput
