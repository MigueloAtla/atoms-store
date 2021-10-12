import styled from 'styled-components'
import { Box } from '../box'

import { compose, lineHeight, color } from 'styled-system'

const composedHelpers = compose(lineHeight, color)

export const Typography = styled(Box)`
  ${composedHelpers}
`

Typography.defaultProps = {
  // as: 'p',
  fontWeight: 1
  // color: 'text500',
}
