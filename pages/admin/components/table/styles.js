import styled from 'styled-components'

export const TableStyled = styled.div`
  padding: 1rem;
  box-sizing: border-box;
  width: calc(100% - 50px);
  margin: 0 auto;

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
      tr {
        background-color: white;
        th {
          color: black;
          text-transform: capitalize;
          text-align: left;
          :last-child {
            width: 100px;
          }
        }
      }
    }

    tbody {
      tr {
        background-color: white;
        height: 60px;
        :last-child {
          td {
            border-bottom: 0;
          }
        }
        cursor: pointer;
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
