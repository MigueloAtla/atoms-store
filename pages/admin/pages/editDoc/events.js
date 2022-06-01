export const useEvents = () => {
  const update = () => {
    console.log('update')
  }
  return {
    update
  }
}