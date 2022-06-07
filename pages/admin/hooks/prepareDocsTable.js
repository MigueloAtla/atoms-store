import { useMemo } from 'react'
import { Box } from '@chakra-ui/react'
import styled from 'styled-components'
import Img from 'react-cool-img'
import DeleteRowButton from '@/admin/atoms/deleteRowButton'
import SelectForDeleteRelationButton from '@/admin/atoms/selectForDeleteRelationButton'

const usePrepareTable = ({ collection, deleteCol = false }) => {
  // Prepare columns
  const arr = []
  if (collection.length > 0) {
    const ordered = Object.entries(collection[0]).sort(
      (a, b) => a[1].order - b[1].order
    )

    const fields_ordered = ordered.map(m => m[0])
    fields_ordered.map(f => {
      arr.push({
        Header: f,
        accessor: f
      })
    })
    // deleteCol &&
    //   arr.push({
    //     Header: 'Delete',
    //     accesor: 'id',
    //     Cell: DeleteRowButton
    //   })
  }

  const columns = useMemo(() => arr, [arr])

  // Prepare data
  const dataArr = []
  collection &&
    collection.map(c => {
      let id = { id: c.id }
      let fields = {}
      Object.keys(c).map(key => {
        if (key !== 'id') {
          if(key === 'seen') {
            fields = { ...fields, [key]: c[key]}
          }
          else fields = { ...fields, [key]: c[key].value }
        }
        if (c[key].type === 'image') {
          fields = {
            ...fields,
            [key]: <TableImg src={c[key].value} />
          }
        }
      })
      fields = { ...fields, ...id }
      dataArr.push(fields)
    })
  const data = useMemo(() => dataArr, [collection])
  return { data, columns }
}

export default usePrepareTable

const TableImg = ({ src }) => {
  return (
    <Box
      border='1px solid #333'
      borderRadius='50%'
      w='80px'
      h='80px'
      overflow='hidden'
    >
      <TableImgStyled
        quality='50'
        src={src}
        alt='table image'
        width='90px'
        height='90px'
      />
    </Box>
  )
}

export const TableImgStyled = styled(Img)`
  overflow: hidden;
  object-fit: cover;
  height: 100%;
  width: 100%;
  transform: scale(1.1);
`
