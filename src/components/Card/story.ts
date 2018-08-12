import { storiesOf } from '@storybook/vue'
// import { action } from '@storybook/addon-actions'
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

storiesOf('Card', module).add('Default', () => ({
  components: { Card },
  data: () => {
    return {
      cards: [
        {
          id: 'key1',
          x: 100,
          y: 200,
          value: `どこで生れたかとんと見当けんとうがつかぬ。何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは。何で`
        },
        {
          id: 'key2',
          x: 600,
          y: 300,
          value: `何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは`
        }
      ],
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
