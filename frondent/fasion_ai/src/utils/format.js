export const formatCurrency = (value) => {
  const number = Number(value)
  if (Number.isNaN(number)) return '$0.00'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(number)
}
