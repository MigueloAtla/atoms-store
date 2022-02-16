import React, { useState } from 'react'
import styled from 'styled-components'

export default function TableTr ({ onClick, row }) {
  const [scale, setScale] = useState(1)
  return (
    <tr
      onMouseDown={() => {
        setScale(0.97)
      }}
      onMouseUp={() => {
        setScale(1)
      }}
      style={{
        transform: `scale(${scale})`,
        transition: 'transform 0.1s ease-out'
      }}
      onClick={onClick}
      {...row.getRowProps()}
    >
      {row.cells.map((cell, i) => {
        return (
          <TdStyled seen={row.original.seen} key={i} {...cell.getCellProps()}>
            {cell.render('Cell')}
          </TdStyled>
        )
      })}
    </tr>
  )
}

const TdStyled = styled.td`
  background-color: ${({seen}) => seen === false && '#18282b'};
  max-width: 100px;
  max-height: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
