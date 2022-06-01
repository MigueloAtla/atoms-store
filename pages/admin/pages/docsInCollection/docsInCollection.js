// react
import React, { useRef } from 'react'
import { useHistory } from 'react-router-dom'

import * as S from '../../styles'

// Components
import Table from '@/admin/components/table'
import { Flex } from '@chakra-ui/react'
import * as Buttons from './buttons'

// HOC
import withPageHoc from '../pageHoc'

// store
import useStore from '@/admin/store/store'

// Hooks
import { useInitialHook } from './initialHook'

const DocsInCollection = ({
  data, 
  columns,
  type
}) => {
  let history = useHistory()
  const setId = useStore(state => state.setId)
  const pageWidth = useRef(null)

  const onClick = id => {
    setId(id)
    history.push(`/admin/${type}/${id}`)
  }

  return (
    <S.ContentStyled ref={pageWidth}>
      {data.length > 0 ? (
        <Table
          columns={columns}
          data={data}
          type={type}
          onClick={onClick}
        />
      ) : (
        <Flex w='100%' h='100%' justify='center' align='center'>
          You may want to create a {type}
        </Flex>
      )}
    </S.ContentStyled>
  )
}

export default withPageHoc({
  controller: useInitialHook,
  header: {
    back: false,
    title: '::collection'
  },
  buttons: Buttons,
  events: {
    load: 'collection',
  },
  allowed_roles: ['admin', 'editor'],
})(DocsInCollection)
