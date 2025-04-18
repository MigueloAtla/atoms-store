import React, { useEffect } from 'react'

import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  usePagination,
  useRowSelect
} from 'react-table'

// import { useHistory } from 'react-router-dom'
import { Input, HStack, Select } from '@chakra-ui/react'
import { IconButton } from '@chakra-ui/react'
import {
  Table as TableComp,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from '@chakra-ui/icons'

// Styles
import { TableStyled } from './styles'

// Components
import TableTr from '@/admin/components/tableTr'
import styled from 'styled-components'

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
      <Input
        variant='filled'
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

function Table ({ 
  columns, 
  data, 
  type, 
  onClick,
  compact = true,
  clickRowData = 'id',
  rowHeight = '100px',
  footer = true,
  fixedFooter = true,
  setRemoveList= () => {},
  junctionName = '',
  id = '',
  styleType = ''
  }) {
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

  const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = React.useRef()
      const resolvedRef = ref || defaultRef
  
      React.useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate
      }, [resolvedRef, indeterminate])
  
      return (
        <>
          <input 
            type="checkbox" 
            ref={resolvedRef} 
            {...rest} 
            style={{
              position: 'absolute',
              left: 'calc(50% - 6px)',
              top: 'calc(50% - 6px)'
            }}
          />
        </>
      )
    }
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
    selectedFlatRows,
    state: { pageIndex, pageSize, selectedRowIds }
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
    usePagination,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        // Let's make a column for selection
        {
          id: 'selection',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ])
    }
  )

  useEffect(() => {
    if(junctionName !== '') {

      const spliceRelations = junctionName.split(
        '_'
        )
      const values = selectedFlatRows.map(row => {
        if (spliceRelations[1] === type) {
          return { id: `${id}_${row.values.id}`, junction: junctionName }
        } else {
          return { id: `${row.values.id}_${id}`, junction: junctionName }
        }
      })
      
      if(values.length === 0) setRemoveList([])
      else setRemoveList((prevState) => [...prevState, ...values])
    
    }
    else {
      const values = selectedFlatRows.map(row => row.values.id)
      setRemoveList([...values])
    }
  }, [selectedRowIds])

  // table styled
  const TableStyledComp = styleType === 'relatedDocs' ? 
    styled(TableStyled)`
      padding: 0;
      margin: 0;
      border: 1px solid #c6c6c6;
      border-radius: 5px;
      width: 100%;
    ` : 
    styled(TableStyled)`
      // some specific styles
    `

  return (
    <>
      <TableStyledComp rowHeight={rowHeight} compact={compact}>
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <TableComp {...getTableProps()}>
          <Thead bg='secondary_bg'>
            {headerGroups.map((headerGroup, i) => (
              <tr key={i} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, i) => {
                  return (
                    <th scope='col' key={i} {...column.getHeaderProps()}>
                      {column.render('Header')}
                    </th>
                  )
                })}
              </tr>
            ))}
          </Thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row)
              return (
                <TableTr
                  key={i}
                  onClick={() => {
                    if(clickRowData === 'id') {
                      onClick(row.values.id)
                    }
                    else {
                      onClick(row.values)
                    }
                  }}
                  row={row}
                />
              )
            })}
          </tbody>
        </TableComp>
        {
          footer &&
          <PaginationStyled 
            bg='secondary_bg'
            borderTop='1px solid'
            borderColor='background'
            spacing='24px' 
            justify='center' 
            fixedFooter={fixedFooter}>
          <IconButton
            size='xs'
            outlineColor='#11101d'
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            fontSize='10px'
            icon={<ArrowLeftIcon />}
          />
          <IconButton
            size='xs'
            outlineColor='#11101d'
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            icon={<ChevronLeftIcon />}
          />
          <IconButton
            size='xs'
            outlineColor='#11101d'
            onClick={() => nextPage()}
            disabled={!canNextPage}
            icon={<ChevronRightIcon />}
          />
          <IconButton
            size='xs'
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
          <span style={{ margin: '0 40px' }}>|</span>
          <span style={{ margin: '0' }}>Go to page: </span>
          <Input
            type='number'
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '60px', height: '30px' }}
          />{' '}
          <Select
            w='120px'
            h='30px'
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
        </PaginationStyled>}
      </TableStyledComp>
    </>
  )
}

// export default ContentTable
export default Table

const PaginationStyled = styled(HStack)`
  position: ${({fixedFooter}) => fixedFooter ? 'fixed': 'sticky'};
  bottom: ${({fixedFooter}) => fixedFooter ? '0': '0px'};
  left: ${({fixedFooter}) => fixedFooter ? '66px': '0'};
  right: ${({fixedFooter}) => fixedFooter ? '0': 'unset'};

  /* background-color: white; */
  margin: 0 10px;
  /* margin-top: 24px; */
  /* width: 100%; */
  height: 40px;
  /* border-top: 1px solid; */
`
