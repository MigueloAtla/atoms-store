// React / Next
import { Link } from 'react-router-dom'

import { Flex, Text } from '@chakra-ui/react'

// HOC
import withPageHoc from '../pageHoc'

// hooks
import { useInitialHook } from './initialHook'

// buttons
import { CreateButton } from './buttons'

// Utils
import { capitalizeFirstLetter } from '../../utils/utils'

const CollectionsList = ({ collections }) => {

  return (
    <Flex direction='column' height='100%'>
      <Flex
        w='100%'
        h='100%'
        justify='center'
        align='center'
        direction='column'
        gridGap='10px'
      >
        {collections !== undefined &&
          collections.length > 0 &&
          collections.map((collection, i) => {
            return (
              <Link
                style={{ width: 'calc(100% - 50px)', height: '100%' }}
                to={`/admin/collection/${collection.name}`}
                key={i}
              >
                <Flex
                  bg='white'
                  height='75px'
                  width='100%'
                  align='center'
                  borderRadius='10px'
                >
                  <Text as='h4' fontSize='22px' ml='30'>
                    {capitalizeFirstLetter(collection.name)}
                  </Text>
                </Flex>
              </Link>
            )
          })}
      </Flex>
    </Flex>
  )
}

export default withPageHoc({
  controller: useInitialHook,
  header: {
    back: false,
    title: 'Collections list'
  },
  events: {
    hook: () => {},
    update: null,
    load: 'collections',
    created: {}
  },
  buttons: { createbutton: CreateButton },
  allowed_roles: ['admin']
})(CollectionsList)
