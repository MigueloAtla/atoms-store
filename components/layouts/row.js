import { Flex } from 'rebass'

const Row = ({ children, center, ...props }) => {
  let align
  switch (center) {
    case 'h':
      align = { justifyContent: 'center' }
      break
    case 'v':
      align = { alignItems: 'center' }
      break
    case true:
      align = {
        alignItems: 'center',
        justifyContent: 'center'
      }
      break
  }

  return (
    <Flex flexDirection='row' {...props} sx={align}>
      {children}
    </Flex>
  )
}

export default Row
