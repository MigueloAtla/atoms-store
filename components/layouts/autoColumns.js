import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass/styled-components'

const AutoColumns = ({ gap, ...props }) => (
  <Box
    sx={{
      display: 'grid',
      gridGap: gap,
      gridTemplateColumns: 'repeat(auto-fit, minmax(128px, 1fr))'
    }}
    {...props}
  />
)

AutoColumns.propTypes = {
  /** The component's value*/
  gap: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}
AutoColumns.defaulProps = {
  /** The component's value*/
  gap: 0
}

export default AutoColumns
