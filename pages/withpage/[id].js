
                import React from 'react'
                import { getCollection, getDocByID } from '@/firebase/client'

                import { GlobalStyles, getComponents } from '@/theme'

                import { LayoutStyled } from '@/layouts/postLayout'
                import { Column, Row, AutoColumns } from '@/layouts/index'

                export default function Withpag ({ withpag }) {
                    const {Title} = getComponents(withpag)

                      return (
                        <LayoutStyled width='100%'>
                          <GlobalStyles />
                          <Column center>
                          <Title />
                          </Column>
                        </LayoutStyled>
                        )
                      }

                      export async function getStaticProps ({ params: { id } }) {
                        const withpag = await getDocByID('withpage', id)

                          return {
                            props: {
                              withpag
                            }
                          }
                        }

                        export async function getStaticPaths () {
                          const withpage = await getCollection('withpage')
                          return {
                            paths:
                            withpage &&
                            withpage.map(el => ({
                              params: { id: String(el.id) }
                            })),
                            fallback: false
                          }
                        }

                        