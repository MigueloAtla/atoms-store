
                import React from 'react'
                import { getCollection, getDocByID } from '@/firebase/client'

                import { GlobalStyles, getComponents } from '@/theme'

                import { LayoutStyled } from '@/layouts/postLayout'
                import { Column, Row, AutoColumns } from '@/layouts/index'
                
                export default function Albu ({ Albu }) {
                    const {Title, Cover} = getComponents(Albu)
                      
                      return (
                        <LayoutStyled width='100%'>
                          <GlobalStyles />
                          <Column center>
                          <Title /> <Cover />
                          </Column>
                        </LayoutStyled>
                        )
                      }
                      
                      export async function getStaticProps ({ params: { id } }) {
                        const Albu = await getDocByID('Album', id)
                          
                          return {
                            props: {
                              Albu
                            }
                          }
                        }
                        
                        export async function getStaticPaths () {
                          const Album = await getCollection('Album')
                          return {
                            paths:
                            Album &&
                            Album.map(el => ({
                              params: { id: String(el.id) }
                            })),
                            fallback: false
                          }
                        }
                        
                        
                        