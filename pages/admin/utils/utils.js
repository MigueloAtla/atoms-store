export const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
export const getTypes = (junction, type) => {
  const spliceRelations = junction.split('_')
  let type1, type2
  if (spliceRelations[1] === type) {
    type1 = spliceRelations[1]
    type2 = spliceRelations[2]
  } else {
    type1 = spliceRelations[2]
    type2 = spliceRelations[1]
  }
  return { type1, type2 }
}

export const docArrayToObject = (docArray) => {
  const docObject = {}
  docArray.map((doc, i) => {
    docObject[doc[0]] = doc[1]
  })
  return docObject
}
export const docObjectToArray = (docObject) => {
  const docArray = []
  for (let key in docObject) {
    docArray.push([key, docObject[key]])
  }
  return docArray
}

export const getDocTitle = (content) => {
  return content
    ? content.title
      ? content.title.value
      : content.name
      ? content.name.value
      : 'Unknown document'
    : ''
}