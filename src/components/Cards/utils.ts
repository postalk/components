import { CardInfo } from '../types'
import { GRID, CARD_PADDING, UNIT } from '../numbers'
import {
  width as windowWidth,
  height as windowHeight
} from '@/components/browser'
import { escapeHTML, nl2br, grid } from '@/components/utils'

export const copyCards = (e: ClipboardEvent, cards: CardInfo[]) => {
  cards.sort((a, b) => {
    if (a.x + a.y < b.x + b.y) {
      return -1
    }
    if (a.x + a.y > b.x + b.y) {
      return 1
    }
    return 0
  })

  const medianX = grid((cards[cards.length - 1].x + cards[0].x) / 2)
  const medianY = grid((cards[cards.length - 1].y + cards[0].y) / 2)

  e.clipboardData.setData(
    'text/plain',
    cards.map(card => card.value).join('\n')
  )
  e.clipboardData.setData(
    'text/html',
    cards
      .map(
        c =>
          `<span data-y="${c.y - medianY}" data-x="${c.x -
            medianX}" data-color="${c.color}">${c.value}</span>`
      )
      .join()
  )
}

export const getPastedCards = (
  spans: NodeListOf<HTMLSpanElement>,
  author: string
) =>
  Array.prototype.slice
    .call(spans)
    .filter(
      (el: HTMLSpanElement) =>
        el.textContent && el.dataset.x && el.dataset.y && el.dataset.color
    )
    .map((el: HTMLSpanElement) => ({
      x: grid(Math.floor(windowWidth() / 2)) + Number(el.dataset.x) - GRID * 5,
      y: grid(Math.floor(windowHeight() / 2)) + Number(el.dataset.y) - GRID,
      color: el.dataset.color as string,
      value: el.textContent,
      author
    }))

export const getMultipleCards = (text: string) => {
  const cards: Array<{ offset: number; value: string }> = []
  const paragraphs = text.match(/[^\r\n]+((\r|\n|\r\n)[^\r\n]+)*/g)
  let offset = 0
  if (paragraphs) {
    paragraphs.forEach(p => {
      const testTxt = nl2br(escapeHTML(p))
      const test = document.createElement('div')
      test.className = 'calc-text-width'
      test.innerHTML = testTxt
      document.body.appendChild(test)
      const height = test.clientHeight
      document.body.removeChild(test)
      const brMatch = testTxt.match(/<br \/>/g)
      const paddingNum = brMatch ? brMatch.length + 1 : 1
      if (!!p && !!p.trim()) {
        cards.push({
          offset,
          value: p
        })
        offset = grid(
          offset +
            height +
            paddingNum * CARD_PADDING * 2 +
            paddingNum +
            2 +
            UNIT / 2
        )
        /*
            font-size: 13
            line-height: 1.5
            padding top, bottom: 8
            border top, bottom: 1
            card's width = calc(12rem - 1rem - 2px);
            additional = 16 / 2
          */
      }
    })
  } else {
    cards.push({
      offset,
      value: text
    })
  }
  return cards
}
