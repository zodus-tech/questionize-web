export const calculateMonthsBetween = (start: string, end: string) => {
  return (
    (new Date(end).getTime() - new Date(start).getTime()) /
    (1000 * 60 * 60 * 24 * 30.44)
  ).toFixed(0)
}

export const getYearRange = () => {
  const today = new Date()

  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(today.getFullYear() - 1)

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const startDate = formatDate(oneYearAgo)
  const endDate = formatDate(today)
  return [startDate, endDate]
}
