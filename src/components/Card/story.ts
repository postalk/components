import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'
import Card from './index.vue'

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
      this.diffX -= x
      this.diffY -= y
      this.moving = key
    },
    stop() {
      this.cards = this.cards.map((card) => {
        return { ...card, x: card.x + this.diffX, y: card.y + this.diffY }
      })
      this.diffX = 0
      this.diffY = 0
      this.moving = undefined
    }
  }
}))
