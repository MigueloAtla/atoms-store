import React from 'react'

import { ButtonStyled } from '../button/styles'

const UpdateButton = ({ type }) => {
  return (
    <ButtonStyled form='edit-form' type='submit'>
      Update {type.slice(0, -1)}
    </ButtonStyled>
  )
}

export default UpdateButton
