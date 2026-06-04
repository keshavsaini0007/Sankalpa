export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const getErrorMessage = (error) => {
  if (error.response?.data?.message) return error.response.data.message
  if (error.message) return error.message
  return 'Something went wrong'
}
