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

export const isHeadline = (str: string, color: string) => {
  return getHeadlineHeight(str) < 20 && (color !== 'white' && !!color)
}

export const isOrderedList = (str: string) =>
  !!str.match(/\r?\n/) && !!str.match(/^[0-9０-９](\.?)(\s|　)/)
export const isTable = (str: string) => !!str.match(/[\s|　][\/|／][\s|　]/)

export const isYoutube = (str: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/
  const match = str.match(regExp)
  return !!match && match[2].length === 11
}

export const isTwitter = (str: string) => {
  const regExp = /^https\:\/\/twitter\.com\/.+\/status\/([0-9]+)/
  return !!str.match(regExp)
}

export const getHeadlineHeight = (txt: string) => {
  const testTxt = nl2br(escapeHTML(txt))
  const test = document.createElement('div')
  test.className = 'calc-headline-height'
  test.innerHTML = testTxt
  document.body.appendChild(test)
  const height = test.clientHeight
  document.body.removeChild(test)
  return height
}
