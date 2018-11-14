import { CardInfo } from './types'
import { OFFSET, GRID } from './numbers'

export const cards: CardInfo[] = [
  {
    id: 'key1',
    x: GRID * 5 + OFFSET,
    y: GRID * 14 + OFFSET,
    value:
      'とんこつラーメン\n' +
      '油そば野菜油 google.com 増し増しスペシャル\n' +
      'うどん',
    color: 'white',
    author: 'me'
  },
  {
    id: 'key2',
    x: GRID * 25 + OFFSET,
    y: GRID * 8 + OFFSET,
    value: '適当に遊んで暮らす毎日',
    color: 'red',
    author: 'me'
  },
  {
    id: 'key3',
    x: GRID * 5 + OFFSET,
    y: GRID * 8 + OFFSET,
    value: '福岡でなに食べるか',
    color: 'blue',
    author: 'me'
  },
  {
    id: 'key4',
    x: GRID * 25 + OFFSET,
    y: GRID * 14 + OFFSET,
    value:
      'google.com ようやくの思池がある<script>alert("aaa")</script>。吾輩は池に坐ってて見た。別 （ ふんべつ ） も出ない。',
    color: 'white',
    author: 'me'
  },
  {
    id: 'key5',
    x: GRID * 45 + OFFSET,
    y: GRID * 8 + OFFSET,
    value: 'My Profile',
    color: 'yellow',
    author: 'me'
  },
  {
    id: 'key6',
    x: GRID * 45 + OFFSET,
    y: GRID * 14 + OFFSET,
    value: `https://i.gyazo.com/4215f0df9b4c256b39afd12327f40277.png`,
    color: 'white',
    author: 'me'
  },
  {
    id: 'key7',
    x: GRID * 25 + OFFSET,
    y: GRID * 28 + OFFSET,
    value: 'google.com / hoge / sega\nteko / neko / tako',
    color: 'white',
    author: 'me'
  }
]
