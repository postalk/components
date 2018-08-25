import { storiesOf } from '@storybook/vue'
import Card from './index.vue'
import Vue from 'vue'

interface CardType {
  id: string
  x: number
  y: number
  value: string
}

interface VueWithData extends Vue {
  cards: CardType[]
  diffX: number
  diffY: number
  moving?: string
}

const cards = [
  {
    id: 'key1',
    x: 48,
    y: 240,
    value: 'とんこつラーメン\n' + '油そば野菜油増し増しスペシャル\n' + 'うどん',
    color: 'yellow'
  },
  {
    id: 'key2',
    x: 600,
    y: 360,
    value: 'BACK STREET BOY',
    color: 'red'
  },
  {
    id: 'key3',
    x: 600,
    y: 120,
    value:
      'ようやくの思いで笹原を這い出すと向うに大きな池がある。吾輩は池の前に坐ってどうしたらよかろうと考えて見た。別にこれという 分別 （ ふんべつ ） も出ない。',
    color: 'blue'
  },
  {
    id: 'key4',
    x: 480,
    y: 240,
    value: '適当に遊んで暮らす毎日であります',
    color: ''
  }
]

storiesOf('Card', module).add('Multiple', () => ({
  components: { Card },
  data: () => {
    return {
      cards,
      diffX: 0,
      diffY: 0,
      moving: undefined
    }
  },
  template: `<div>
    <Card
      v-for="card in cards"
      :key="card.id"
      :id="card.id"
      :value="card.value"
      :color="card.color"
      :initialX="card.x"
      :initialY="card.y"
      :diffX="diffX"
      :diffY="diffY"
      :moving="moving"
      :handleMove="move"
      :handleStop="stop"
    />
  </div>`,
  methods: {
    move(x, y, key) {
      const self = this as VueWithData
      self.diffX -= x
      self.diffY -= y
      self.moving = key
    },
    stop() {
      const self = this as VueWithData
      self.cards = self.cards.map((card) => {
        return { ...card, x: card.x + self.diffX, y: card.y + self.diffY }
      })
      self.diffX = 0
      self.diffY = 0
      self.moving = undefined
    }
  }
}))
