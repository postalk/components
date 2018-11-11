import { CardInfo } from './types'
import { OFFSET, GRID } from './numbers'

export const cards: CardInfo[] = [
  {
    id: 'key1',
    x: GRID * 5 + OFFSET,
    y: GRID * 14 + OFFSET,
    value: 'とんこつラーメン\n' + '油そば野菜油増し増しスペシャル\n' + 'うどん',
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
      'ようやくの思いで笹原を這い出すと向うに大きな池がある。吾輩は池の前に坐ってどうしたらよかろうと考えて見た。別にこれという 分別 （ ふんべつ ） も出ない。',
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
  }
]
