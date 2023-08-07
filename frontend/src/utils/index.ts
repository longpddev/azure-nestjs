export function countWords(docs: string) {
  const text = docs.replace(/[:\\,.-]/g, ' ').replace(/\s+/g, ' ')
  if(text.length === 0) return 0
  return text.split(' ').length
}