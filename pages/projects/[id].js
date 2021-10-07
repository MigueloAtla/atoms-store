
              import React from 'react'
              import { getCollection, getDocByID } from '@/firebase/client'
        
              import { withTheme, PostWrapperStyled } from '@/theme'
        
              import styled from 'styled-components'
              import { LayoutStyled } from '@/layouts/postLayout'
        
              export default function Project ({ project }) {
                const { Title, Description, Image, Content } = withTheme(project)
        
                return (
                  <>
                  <h1>projects</h1>
                  </>
                )
              }
        
              export async function getStaticProps ({ params: { id } }) {
                const project = await getDocByID('project', id)
        
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
        
              
              