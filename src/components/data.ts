import { CardInfo } from './types'
import { OFFSET, GRID } from './numbers'

export const dummyHTML: string = `
<img class="url__favicon" src="https://d247fv9ioqt5ap.cloudfront.net/apple-touch-icon.png">
<span class="url__sitetitle">postalk</span>
<a class="url__title" href="https://postalk.io" target="_blank">postalk | オンラインの議論を加速させるカード型チャットツール</a>
<div class="url__description">postalk はカードを並べてコミュケーションができるオンラインツールです。リモートワークでの遠隔ミーティング・画像を使った議論などに最適です。</div>
<img class="url__img" src="https://d247fv9ioqt5ap.cloudfront.net/images/ogimage.png">
`

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
    value: '適当に遊んで暮らす',
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
    value: 'google.com / アイコス / レイガン\n理解者 / 鉄球の上に / 瓶ビール',
    color: 'white',
    author: 'me'
  }
]
