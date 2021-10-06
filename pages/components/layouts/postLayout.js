import styled from 'styled-components'
import { Box } from 'rebass/styled-components'

export const LayoutStyled = styled(Box)`
  margin: 0 auto;
  max-width: 700px;
  background-color: ${props => props.theme.colors.bgPrimary};
`
