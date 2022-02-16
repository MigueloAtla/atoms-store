import React, { useMemo, useEffect, useState } from 'react'
import { getPayments } from '@/firebase/client'

import dayjs from 'dayjs'

// components
import Table from '@/admin/components/table'
import {
  Flex, 
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'

import styled from 'styled-components'

const StripePaymentsHistory = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [ payments, setPayments ] = useState([])
  const [ values, setValues ] = useState({})

  useEffect(() => {
    getPayments().then(res => {
      console.log(res)
      const payments_formatted = res.map((payment) => {
        const { id, created, amount, status } = payment
        let created_formatted = dayjs(created * 1000).format('DD/MMMM/YYYY')
        let amount_formatted = `${amount / 100} ${payment.currency}`
        return {
          ...payment,
          created: created_formatted,
          amount: amount_formatted,
        }
      })
      setPayments(payments_formatted)
    })
  }, [])

  const cols = [
    {
      Header: 'id',
      accessor: 'id'
    },
    {
      Header: 'created',
      accessor: 'created'
    },
    {
      Header: 'amount',
      accessor: 'amount'
    },
    {
      Header: 'status',
      accessor: 'status'
    }
  ]

  const columns = useMemo(() => cols, [])
  const data = useMemo(() => payments, [payments])

  const onRowClick = (row_values) => {
    console.log(row_values)
    onOpen()
    setValues(row_values)
  } 
  
  return (
    <>
      <Flex backgroundColor='#635bff' alignItems='center' justifyContent='space-between' p='30px'>
        <p style={{color: 'white'}}>Recent activity in your stripe account (last 15 payments)</p>
        <a href='https://dashboard.stripe.com/test/payments' target='_blank'>
          <Button >View full history in Stripe</Button>
        </a>
      </Flex>
      <Table
        columns={columns}
        data={data}
        type={'payments'}
        onClick={onRowClick}
        footer={false}
        clickRowData='row'
        rowHeight='50px'
      />
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContentStyled minW='50vw'>
          <ModalHeader>Payment data</ModalHeader>
          <ModalCloseButton />
          <ModalBodyStyled>
            <Flex>
              {
                values && (
                  <Flex flexDirection='column'>
                    <p>Id: {values.id}</p>
                    <p>Amount: {values.amount}</p>
                    <p>Date: {values.created}</p>
                    <p>Status: {values.status}</p>
                    <PaymentDataStripeSection>
                      <a href={`https://dashboard.stripe.com/test/payments/${values.id}`} target='_blank'>
                        <Button >View payment data in Stripe</Button>
                      </a>
                    </PaymentDataStripeSection>
                  </Flex>
                )
              }
            </Flex>
          </ModalBodyStyled>
        </ModalContentStyled>
      </Modal>
    </>
  )
}

export default StripePaymentsHistory

const PaymentDataStripeSection = styled(Flex)`
  background-color: #635bff;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 30px;
  position: absolute;
  bottom: 0;
  left: 0;
`

const ModalContentStyled = styled(ModalContent)`
  background-color: #ffffffd1;
  backdrop-filter: blur(10px);
  height: 80%;
  overflow: hidden;
`

const ModalBodyStyled = styled(ModalBody)`
  margin: 50px 10px;
  /* overflow-y: scroll; */
  & > div {
    width: 100%;
    & > div {
      width: 100%;
    }
  }
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #282828;
    border-radius: 3px;
  }
`