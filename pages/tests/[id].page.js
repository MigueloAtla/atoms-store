
                import React from 'react'
                import { getCollection, getDocByID } from '@/firebase/client'

                import { GlobalStyles, getComponents, getValues } from '@/theme'

                import { LayoutStyled } from '@/layouts/index'
                import { Column, Row, AutoColumns } from 'styled-bento'

                const TestView = ({ testComps, testValues }) => {
                    const {Title} = testComps
                    return (
                      <LayoutStyled width='100%'>
                        <GlobalStyles />
                        <Column center>
                        <Title />
                        </Column>
                      </LayoutStyled>
                      )
                }

                export default function Test ({ test }) {
                    const testComps = getComponents(test)
                    const testValues = getValues(test)

                      return (
                        <TestView testComps={testComps} testValues={testValues} />
                      )
                      }

                      export async function getStaticProps ({ params: { id } }) {
                        const test = await getDocByID('tests', id)

                          return {
                            props: {
                              test
                            }
                          }
                        }

                        export async function getStaticPaths () {
                          const tests = await getCollection('tests')
                          return {
                            paths:
                            tests &&
                            tests.map(el => ({
                              params: { id: String(el.id) }
                            })),
                            fallback: false
                          }
                        }

                        