export const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
export const getTypes = (junction, type) => {
  console.log(junction)
  console.log(type)
  const spliceRelations = junction.split('_')
  let type1, type2
  if (spliceRelations[1] === type) {
    type1 = spliceRelations[1]
    type2 = spliceRelations[2]
  } else {
    type1 = spliceRelations[2]
    type2 = spliceRelations[1]
  }
  console.log('type1', type1)
  console.log('type2', type2)
  return { type1, type2 }
}
