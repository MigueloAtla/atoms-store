import { Flex } from 'rebass'

const Column = ({ children, center, ...props }) => {
  let align = {}
  switch (center) {
    case 'h':
      align = { alignItems: 'center' }
      break
    case 'v':
      align = { justifyContent: 'center' }
      break
    case true:
      align = {
        alignItems: 'center',
        justifyContent: 'center'
      }
      break
  }

  return (
    <Flex flexDirection='column' {...props} sx={align}>
      {children}
    </Flex>
  )
}

export default Column
