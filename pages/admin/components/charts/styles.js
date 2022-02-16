import styled from 'styled-components'
import { Flex } from '@chakra-ui/react'

export const ChartWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  height: calc(100vh - 90px);
  padding: 50px;
  background-color: rgb(94 94 107 / 37%);
  border-radius: 10px;
  & > canvas {
    width: 100% !important;
    height: 100%;
  }
`

export const SelectChartButton = styled(Flex)`
  width: 50%;
  height: 80px;
  cursor: pointer;
  border: 2px solid black;
  justify-content: center;
  align-items: center;
  :nth-child(odd) {
    border-right: 0;
  }
  :nth-child(1), :nth-child(2) {
    border-bottom: 0;
  }
  &:hover {
    background-color: white;
  }
`

export const SelectTypeChart = styled(Flex)`
  width: 50%;
  height: 60px;
  border: 2px solid black;
  border-right: 0;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  :last-child {
    border-right: 2px solid black;
  }
`

export const StatsWrapper = styled(Flex)`
  flex-direction: column;
  justify-content: space-between;
  border-radius: 10px;
  background-color: rgb(94 94 107 / 37%);
  height: 50%;
  padding: 30px;
`

export const ChartActions = styled(Flex)`
  flex-direction: column;
  justify-content: space-between;
  border-radius: 10px;
  background-color: rgb(94 94 107 / 37%);
  padding: 30px;
`

export const PageWrapper = styled(Flex)`
  gap: 10px;
`

export const Percent = styled(Flex)`
  gap: 10px;
  align-items: center;
`