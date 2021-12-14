import React from 'react'
import * as Templates from '@/admin/previews'

import useStore from '@/admin/store/store'
import { capitalizeFirstLetter } from '@/admin/utils/utils'

const Preview = ({ content }) => {
  const selectedCollectionName = useStore(state => state.selectedCollectionName)
  const templateName = capitalizeFirstLetter(
    selectedCollectionName.slice(0, -1)
  )

  const propsName = selectedCollectionName.slice(0, -1)

  const PreviewTemplate = Templates[templateName]

  const props = {
    [propsName]: content
  }

  console.log(content)

  return (
    <>
      {content && (
        <body>
          <PreviewTemplate {...props} />
        </body>
      )}
    </>
  )
}

export default Preview
