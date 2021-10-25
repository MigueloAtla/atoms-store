import React, { useState } from 'react'

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
          <td style={{ height: '110px' }} key={i} {...cell.getCellProps()}>
            {cell.render('Cell')}
          </td>
        )
      })}
    </tr>
  )
}
