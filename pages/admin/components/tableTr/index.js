import React, { useState } from 'react'
import styled from 'styled-components'
import {
  Tr
} from '@chakra-ui/react'

export default function TableTr ({ onClick, row }) {
  // const [scale, setScale] = useState(1)
  return (
    <Tr bg='secondary_bg'
    _hover={{
      background: 'hover',
    }}
      // onMouseDown={() => {
      //   setScale(0.97)
      // }}
      // onMouseUp={() => {
      //   setScale(1)
      // }}
      // style={{
      //   transform: `scale(${scale})`,
      //   transition: 'transform 0.1s ease-out'
      // }}
      // onClick={onClick}
      {...row.getRowProps()}
    >
      {row.cells.map((cell, i) => {
        // console.log(cell.column.Header === 'Remove')
        // console.log(cell.column.id)
        return (
          <TdStyled 
            onClick={() => {
              cell.column.id !== 'selection' && onClick()
            }}
            // seen={row.original.seen} 
            key={i} 
            {...cell.getCellProps()}>
            {cell.render('Cell')}
          </TdStyled>
        )
      })}
    </Tr>
  )
}


const TdStyled = styled.td`
  max-width: 100px;
  max-height: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
