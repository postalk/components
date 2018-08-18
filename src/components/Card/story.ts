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
    x: 50,
    y: 300,
    value: 'とんこつラーメン\n' + '油そば野菜油増し増しスペシャル\n' + 'うどん'
  },
  {
    id: 'key2',
    x: 600,
    y: 400,
    value: 'ポメラニアン'
  },
  {
    id: 'key3',
    x: 400,
    y: 100,
    value:
      'ようやくの思いで笹原を這い出すと向うに大きな池がある。吾輩は池の前に坐ってどうしたらよかろうと考えて見た。別にこれという 分別 （ ふんべつ ） も出ない。'
  }
]

storiesOf('Card', module).add('Default', () => ({
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
