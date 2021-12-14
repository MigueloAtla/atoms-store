
                import React from 'react'
                import { getCollection, getDocByID } from '@/firebase/client'

                import { GlobalStyles, getComponents } from '@/theme'

                import { LayoutStyled } from '@/layouts/postLayout'
                import { Column, Row, AutoColumns } from '@/layouts/index'

                export default function Recipe ({ recipe }) {
                    const {Asdf} = getComponents(recipe)

                      return (
                        <LayoutStyled width='100%'>
                          <GlobalStyles />
                          <Column center>
                          <Asdf />
                          </Column>
                        </LayoutStyled>
                        )
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

                        