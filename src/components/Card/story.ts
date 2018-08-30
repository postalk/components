import { storiesOf } from '@storybook/vue'
import Card from './index.vue'
import Vue, { ComponentOptions } from 'vue'
import { cards } from '../data'
import { CardInfo } from '@/components/types'

const CardTester: ComponentOptions<Vue> = {
  components: { Card },
  data: () => {
    return {
      cards,
      diffX: 0,
      diffY: 0,
      moving: undefined
    }
  },
  methods: {
    move(x, y, key) {
      const self = this as any
      self.diffX -= x
      self.diffY -= y
      self.moving = key
    },
    stop() {
      const self = this as any
      self.cards = self.cards.map((card: CardInfo) => {
        return { ...card, x: card.x + self.diffX, y: card.y + self.diffY }
      })
      self.diffX = 0
      self.diffY = 0
      self.moving = undefined
    }
  }
}

storiesOf('Card', module).add('Multiple', () => ({
  methods: {},
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
  ...CardTester
}))
