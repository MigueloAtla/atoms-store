import React from 'react'
import { getCollection, getDocByID } from '@/firebase/client'

import { GlobalStyles, getComponents } from '@/theme'

import { LayoutStyled } from '@/layouts/postLayout'
import { Column, Row, AutoColumns } from '@/layouts/index'

export default function Project ({ project }) {
  const { Description, Content, Name } = getComponents(project)

  return (
    <LayoutStyled width='100%'>
      <GlobalStyles />
      <Column center>
        <Name as='h1' fontSize={[4, 5, 7]} color='grey' />
        <Description />
        {Content()}
      </Column>
    </LayoutStyled>
  )
}

export async function getStaticProps ({ params: { id } }) {
  const project = await getDocByID('projects', id)

  return {
    props: {
      project
    }
  }
}

export async function getStaticPaths () {
  const projects = await getCollection('projects')
  return {
    paths:
      projects &&
      projects.map(el => ({
        params: { id: String(el.id) }
      })),
    fallback: false
  }
}
