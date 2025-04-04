import { Button } from '@chakra-ui/button'
import { useColorMode, useColorModeValue } from '@chakra-ui/react'
import CreateDocButton from '@/admin/atoms/createDocButton'
import { useEffect } from 'react'
import useStore from '@/admin/store/store'

export const CreateButton = ({
  type
}) => {
  return <CreateDocButton type={type} />
}

// export const ChangeButton = () => {
//   const { colorMode, toggleColorMode } = useColorMode()
//   // colorTheme
//   const { setColorTheme } = useStore(state => state)

//   useEffect(() => {
//     // set colorTheme
//     // console.log(colorMode)
//     setColorTheme(colorMode)
//   }, [colorMode])
  
//   return <Button onClick={toggleColorMode}>{colorMode}</Button>
// }