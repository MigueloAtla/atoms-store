import styled from 'styled-components'
import { Typography } from '../typography'

export const Heading = styled(Typography)`
  font-size: ${({ fontSize, as }) =>
    fontSize ? fontSize : as === 'h1' ? '64px' : as === 'h2' ? '48px' : '32px'};
`

Heading.defaultProps = {
  as: 'h1',
  fontWeight: 2,
  color: 'black'
}
