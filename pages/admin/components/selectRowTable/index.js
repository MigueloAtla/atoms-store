import React, { useEffect } from 'react'
import styled from 'styled-components'
import {
  useTable,
  useRowSelect,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce
} from 'react-table'
import { Input, InputGroup } from '@chakra-ui/react'
import { useHistory } from 'react-router-dom'

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
      <InputGroup>
        <Input
          variant='filled'
          w='100%'
          focusBorderColor='#11101d'
          value={value || ''}
          onChange={e => {
            setValue(e.target.value)
            onChange(e.target.value)
          }}
          placeholder={`${count} records...`}
        />
      </InputGroup>
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

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <CheckBox type='checkbox' ref={resolvedRef} {...rest} />
      </>
    )
  }
)
IndeterminateCheckbox.displayName = 'IndeterminateCheckbox'

const Table = ({ columns, data, onSelectRow, type, setSelectedLength }) => {
  let history = useHistory()
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
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    state,
    prepareRow,
    selectedFlatRows,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { selectedRowIds }
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes
    },
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
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
          )
        },
        ...columns
      ])
    }
  )

  useEffect(() => {
    onSelectRow(selectedFlatRows)
  }, [selectedFlatRows])

  useEffect(() => {
    setSelectedLength(Object.keys(selectedRowIds).length)
  }, [selectedRowIds])

  // Render the UI for your table
  return (
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
              {headerGroup.headers.map((column, i) => (
                <th key={i} {...column.getHeaderProps()}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {/* <OverflowScroll> */}
          {rows.slice(0, 10).map((row, i) => {
            prepareRow(row)
            return (
              <tr
                key={i}
                {...row.getRowProps()}
                onClick={e => {
                  e.stopPropagation()
                  history.push(`/admin/${type}/${row.values.id}`)
                }}
              >
                {row.cells.map((cell, i) => {
                  return (
                    <td
                      key={i}
                      {...cell.getCellProps()}
                      onClick={e => {
                        if (i === 0) e.stopPropagation()
                      }}
                    >
                      {cell.render('Cell')}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </TableStyled>
  )
}

export default Table

export const TableStyled = styled.div`
  /* padding: 1rem; */
  box-sizing: border-box;
  width: 100%;

  td,
  th,
  table {
    padding: 10px;
  }

  table {
    border-spacing: 0 15px;
    width: 100%;
    border-collapse: separate;
    overflow: hidden;

    td:first-child {
      border-left-style: solid;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    td:last-child {
      border-right-style: solid;
      border-bottom-right-radius: 4px;
      border-top-right-radius: 4px;
    }

    thead {
      height: 50px;
      box-shadow: 0px 3px 3px rgb(0 0 0 / 5%);
      table-layout: fixed;
      display: table;
      tr {
        background-color: white;
        display: table;
        table-layout: fixed;
        width: 100%;
        border-radius: 8px;
        th {
          color: black;
          text-transform: capitalize;
          text-align: left;
          :first-child {
            width: 50px;
          }
        }
      }
    }

    tbody {
      height: calc(90vh - 369px);
      overflow: auto;
      display: flex;
      width: 100%;
      flex-direction: column;
      gap: 15px;
      -ms-overflow-style: none; /* for Internet Explorer, Edge */
      scrollbar-width: none; /* for Firefox */
      overflow-y: scroll;
      tr {
        background-color: white;
        height: 60px;
        display: table;
        table-layout: fixed;
        width: 100%;
        border-radius: 8px;
        cursor: pointer;
        /* :last-child {
          td {
            border-bottom: 0;
          }
        } */
        td {
          padding: 0;
          padding-left: 10px;
          :first-child {
            width: 50px;
          }
        }
        :hover {
          /* background-color: #efefef; */
          background: rgb(236, 236, 241);
          background: linear-gradient(
            314deg,
            rgba(236, 236, 241, 1) 0%,
            rgba(210, 210, 210, 1) 100%
          );
        }
      }

      &::-webkit-scrollbar {
        display: none; /* for Chrome, Safari, and Opera */
      }
    }

    th,
    td {
      font-size: 14px;
      color: gray;
      line-height: 1.4;
      position: relative;

      :last-child {
        border-right: 0;
      }
    }
  }
`
const CheckBox = styled.input`
  transform: scale(1.3);
`
