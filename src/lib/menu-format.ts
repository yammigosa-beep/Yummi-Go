export function formatSar(value: number) {
  if (Number.isNaN(value)) return '0 ر.س'
  const rounded = Math.round(value)
  return `${rounded} ر.س`
}
