export const capitalize = word => {
  return word[0].toUpperCase() + word.slice(1).toLowerCase()
}

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const sortSchema = (schema) => {
  return Object.entries(schema).sort(function (a, b) {
    return a[1].order - b[1].order
  })
}

export const sortDoc = (doc) => {
  return Object.entries(doc).sort((a, b) => a[1].order - b[1].order)
}