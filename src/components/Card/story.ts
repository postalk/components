import { storiesOf } from '@storybook/vue'
import Card from './index.vue'
import Vue, { ComponentOptions } from 'vue'
import { cards } from '../data'
import { action } from '@storybook/addon-actions'

const CardTester: ComponentOptions<Vue> = {
  components: { Card },
  data: () => {
    return {
      card: cards[0],
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
      self.card = {
        ...self.card,
        x: self.card.x + self.diffX,
        y: self.card.y + self.diffY
      }
      self.diffX = 0
      self.diffY = 0
      self.moving = undefined
    },
    start() {
      action('start!')
    },
    update(id: string, value: string) {
      const self = this as any
      self.card = {
        ...self.card,
        value
      }
    },
    remove(id: string) {
      const self = this as any
      self.card = undefined
    },
    select: action('selected!'),
    url: action('url!')
  }
}

storiesOf('Card', module).add('Default', () => ({
  methods: {},
  template: `<div>
    <Card
      v-if="!!card"
      :key="card.id"
      :id="card.id"
      :value="card.value"
      :color="card.color"
      :initial="{ x: card.x, y: card.y }"
      :diff="{ x: diffX, y: diffY }"
      :movingId="moving"
      :selected="false"
      :handleMove="move"
      :handleStop="stop"
      :handleStart="start"
      :handleUpdate="update"
      :handleRemove="remove"
      :handleSelect="select"
      :handleURL="url"
    />
  </div>`,
  ...CardTester
}))
