import React from 'react'
import { getCollection, getDocByID } from '@/firebase/client'

import { GlobalStyles, getComponents, getValues } from '@/theme'

import { LayoutStyled } from '@/layouts/index'
import { Column, Row, AutoColumns } from 'styled-bento'

const RecipeView = ({ recipeComps, recipeValues }) => {
  const { Description, Title } = recipeComps
  return (
    <LayoutStyled width='100%'>
      <GlobalStyles />
      <Column center>
        <Title />
        <Description />
      </Column>
    </LayoutStyled>
  )
}

export default function Recipe ({ recipe }) {
  const recipeComps = getComponents(recipe)
  const recipeValues = getValues(recipe)

  return <RecipeView recipeComps={recipeComps} recipeValues={recipeValues} />
}

export async function getStaticProps ({ params: { id } }) {
  const recipe = await getDocByID('recipes', id)

  return {
    props: {
      recipe
    }
  }
}

export async function getStaticPaths () {
  const recipes = await getCollection('recipes')
  return {
    paths:
      recipes &&
      recipes.map(el => ({
        params: { id: String(el.id) }
      })),
    fallback: false
  }
}
