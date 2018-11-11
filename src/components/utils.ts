import { GRID, OFFSET } from './numbers'

export const escapeHTML = (str: string) => {
  str = str.replace(/&/g, '&amp;')
  str = str.replace(/</g, '&lt;')
  str = str.replace(/>/g, '&gt;')
  str = str.replace(/"/g, '&quot;')
  str = str.replace(/'/g, '&#39;')
  return str
}

export const nl2br = (str: string) => {
  str = str.replace(/\r\n/g, '<br />')
  str = str.replace(/(\n|\r)/g, '<br />')
  return str
}

export const grid = (num: number) => Math.floor(num / GRID) * GRID + OFFSET
