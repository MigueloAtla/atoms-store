import React, { useEffect, useState } from 'react'

// charts
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// firebase
import { getByPeriod } from '@/firebase/client'

// styles
import { SelectChartButton, SelectTypeChart, ChartWrapper, StatsWrapper, PageWrapper, ChartActions, Percent } from './styles'

// components
import { Flex, Icon } from '@chakra-ui/react'
import { BiUpArrow } from 'react-icons/bi'

import dayjs from 'dayjs'
import { useRef } from 'react'
import { Column, Row } from 'styled-bento';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)


const DAY = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
const YEAR = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export const options = {
  fill: true,
  responsive: true,
  maintainAspectRatio : false,
  plugins: {
    legend: {
      display: false,
      position: 'top',
    }
  },
}

const Charts = ({ collection }) => {
  const [data, setData] = useState([])
  const [labels, setLabels] = useState([])
  const [totalArr, setTotalArr] = useState([])
  const [total, setTotal] = useState(0)
  const [dataChart, setDataChart] = useState({})
  const [title, setTitle] = useState()
  const [type, setType] = useState('bar')
  const period = useRef()

  useEffect(() => {
    handlePeriod('month')
  }, [])
  
  useEffect(() => {
    
    setDataChart({
      labels,
      datasets: [
        {
          label: 'Money made (in €)',
          data: totalArr.map((d) => d),
          borderColor: 'rgb(10, 175, 215)',
          backgroundColor: 'rgba(10, 175, 215, 0.5)',
          tension: 0.3,
          pointRadius: 10
        },
        {
          label: 'Money made (in €)',
          data: ['50', '100', '100', '110', '200', '100', '100', '80', '100', '0', '100', '100', '100', '180', '180', '200', '200', '130', '150', '100', '100', '50', '50', '50', '80', '50', '0', '0'],
          borderColor: 'rgba(52, 14, 41, 1)',
          backgroundColor: 'rgba(52, 14, 41, 0.5)',
          tension: 0.3,
          pointRadius: 10
        },
      ],
    })
  }, [labels, totalArr])

  useEffect(() => {

    if(period.current === 'day') {
      let curr_day
      let days_arr = []
      let total = 0
      for (let i = 0; i < labels.length; i++) {
        days_arr.push(0)
      } 
      data.map((el) => {
        curr_day = el.created.toDate().getHours()
        days_arr[curr_day] += el.total.value
        total += el.total.value
      })
      let arr = days_arr.map(n => n.toString())
      setTotal(total)
      setTotalArr(arr)
    }
    
    if(period.current === 'month') {
      let curr_day
      let days_arr = []
      let total = 0
      for (let i = 0; i < dayjs().daysInMonth(); i++) {
        days_arr.push(0)
      }
      data.map((el) => {
        curr_day = dayjs(el.created.toDate()).date()
        days_arr[curr_day - 1] += el.total.value
        total += el.total.value
      })
      let arr = days_arr.map(n => n.toString())
      setTotal(total)
      setTotalArr(arr)
    }

    if(period.current === 'year') {
      let curr_month
      let months_arr = []
      let total = 0
      for (let i = 0; i < labels.length; i++) {
        months_arr.push(0)
      } 
      data.map((el) => {
        curr_month = el.created.toDate().getMonth()
        months_arr[curr_month] += el.total.value
        total += el.total.value
      })
      let arr = months_arr.map(n => n.toString())
      setTotal(total)
      setTotalArr(arr)
    }
    
  }, [data])

  const handlePeriod = (selected_period) => {
    let date 
    let start, end
    
    if (selected_period === 'today' || selected_period === 'yesterday') {
      date = 'day'
    }
    else date = selected_period


    if(selected_period === 'yesterday') {
      start = dayjs().subtract(1, 'day').startOf('day').toDate()
      end = dayjs().subtract(1, 'day').endOf('day').toDate()
    }
    else {
      start = dayjs().startOf(selected_period).toDate()
      end = dayjs().endOf(selected_period).toDate()
    }

    if(date === 'day') {
      setLabels(DAY)
    }
    if(date === 'month') {
      let daysArr = []
      for (let i = 1; i <= dayjs().daysInMonth(); i++) {
        daysArr.push(i.toString())
      }    
      setLabels(daysArr)
    }
    if(date === 'year') {
      setLabels(YEAR)
    }

    getByPeriod(collection, start, end)
    .then((res) => {
      setData(res)
    })

    period.current = date
    setTitle(selected_period)

  }

  return (
    <PageWrapper>
      <Column width='30%' gap='10px'>
        <StatsWrapper>
          <h2>{title}</h2>
          <p>total profits:</p><p style={{
            fontWeight: 'bold',
            fontSize: '20px'
          }}>{total} €</p>

          <Percent>
            <h1 style={{
              color: '#10ff87'
            }}>20%</h1>
            <Icon as={BiUpArrow} color={'#10ff87'} width='2em' height='2em' />
          </Percent>
          Respect last {title}
        </StatsWrapper>
        <ChartActions>
          Select chart type
          <Row>
            <SelectTypeChart onClick={() => {
              setType('line')
            }}>
              Line chart
            </SelectTypeChart>
            <SelectTypeChart onClick={() => {
              setType('bar')
            }}>
              Bar chart
            </SelectTypeChart>
          </Row>
          <Flex mt='30px'>
          Select period
          </Flex>
          <Flex flexWrap='wrap'>
            <SelectChartButton onClick={() => {
              handlePeriod('yesterday')
            }}>
              <p>
                Yesterday 
                <span style={{
                  color: '#10ff87'
                }}>
                  +2%
                </span>
              </p>
            </SelectChartButton>
            <SelectChartButton onClick={() => {
              handlePeriod('day')
            }}>
              <p>
                Today 
                <span style={{
                  color: '#c70039'
                }}>
                  -5%
                </span>
              </p>
            </SelectChartButton>
            <SelectChartButton onClick={() => {
              handlePeriod('month')
            }}>
              <p>
                Last month 
                <span style={{
                  color: '#c70039'
                }}>
                  -15%
                </span>
              </p>
            </SelectChartButton>
            <SelectChartButton onClick={() => {
              handlePeriod('year')
            }}>
              <p>
                Last year 
                <span style={{
                  color: '#10ff87'
                }}>
                  +35%
                </span>
              </p>
            </SelectChartButton>
          </Flex>
        </ChartActions> 
      </Column>
      {data.length > 0 ? (
          <ChartWrapper>
            {type === 'bar' &&  <Bar options={options} data={dataChart} />}
            {type === 'line' &&  <Line options={options} data={dataChart} />}
          </ChartWrapper>
        ) :
        <Flex w='100%' justifyContent='center' alignItems='center' height='50vh'>
          <p>No data here</p>
        </Flex>
      }
    </PageWrapper>
  )
}

export default Charts