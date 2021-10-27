import React from 'react'

import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  usePagination
} from 'react-table'

import { useHistory } from 'react-router-dom'
import { Input, Button, HStack, Select } from '@chakra-ui/react'
import { IconButton } from '@chakra-ui/react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from '@chakra-ui/icons'

// State
import useStore from '../../store/store'

import { TableStyled } from './styles'

// Components
import TableTr from '@/admin/components/tableTr'

// Define a default UI for filtering
function GlobalFilter ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter
}) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <span>
      Search:{' '}
      <Input
        variant='flushed'
        mt='24px'
        w='100%'
        value={value || ''}
        onChange={e => {
          setValue(e.target.value)
          onChange(e.target.value)
        }}
        placeholder={`${count} records...`}
      />
    </span>
  )
}

// Define a default UI for filtering
function DefaultColumnFilter ({
  column: { filterValue, preFilteredRows, setFilter }
}) {
  const count = preFilteredRows.length

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

function Table ({ columns, data, type }) {
  let history = useHistory()
  const setId = useStore(state => state.setId)
  const filterTypes = React.useMemo(
    () => ({
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      }
    }),
    []
  )

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter
    }),
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
      initialState: {
        pageIndex: 0,
        pageSize: 20,
        hiddenColumns: ['id', 'content']
      }
    },
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    usePagination
  )

  return (
    <>
      <TableStyled>
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup, i) => (
              <tr key={i} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, i) => {
                  return (
                    <th key={i} {...column.getHeaderProps()}>
                      {column.render('Header')}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row)
              return (
                <TableTr
                  key={i}
                  onClick={() => {
                    setId(row.values.id)
                    history.push(`/admin/${type}/${row.values.id}`)
                  }}
                  row={row}
                />
              )
            })}
          </tbody>
        </table>
        <div className='pagination'>
          <HStack w='100%' spacing='24px' justify='center' mt='24px'>
            <IconButton
              outlineColor='#11101d'
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              fontSize='10px'
              icon={<ArrowLeftIcon />}
            />
            <IconButton
              outlineColor='#11101d'
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              icon={<ChevronLeftIcon />}
            />
            <IconButton
              outlineColor='#11101d'
              onClick={() => nextPage()}
              disabled={!canNextPage}
              icon={<ChevronRightIcon />}
            />
            <IconButton
              outlineColor='#11101d'
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              fontSize='10px'
              icon={<ArrowRightIcon />}
            />
            <span>
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </span>
            <span>
              | Go to page:{' '}
              <Input
                type='number'
                defaultValue={pageIndex + 1}
                onChange={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0
                  gotoPage(page)
                }}
                style={{ width: '100px' }}
              />
            </span>{' '}
            <Select
              w='120px'
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value))
              }}
            >
              {[1, 2, 10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </Select>
          </HStack>
        </div>
      </TableStyled>
    </>
  )
}

// export default ContentTable
export default Table