import { storiesOf } from '@storybook/vue'
import Cards from './index.vue'
import Vue, { ComponentOptions } from 'vue'
import { cards } from '../data'
import { CardInfo } from '@/components/types'

const SelectTester: ComponentOptions<Vue> = {
  components: { Cards },
  data: () => {
    return {
      cards,
      diffX: 0,
      diffY: 0,
      moving: undefined
    }
  },
  methods: {
    stop(ids, diffX, diffY) {
      const self = this as any
      self.cards = self.cards.map(
        (card: CardInfo) =>
          ids.includes(card.id)
            ? {
                ...card,
                x: card.x + diffX,
                y: card.y + diffY
              }
            : card
      )
    },
    update(id, value) {
      const self = this as any
      self.cards = self.cards.map(
        (card: CardInfo) => (card.id === id ? { ...card, value } : card)
      )
    },
    remove(id) {
      const self = this as any
      self.cards = self.cards.filter((card: CardInfo) => card.id !== id)
    }
  }
}

storiesOf('Cards', module).add('Default', () => ({
  methods: {},
  template: `<Cards
    :cards="cards"
    :handleStop="stop"
    :handleUpdate="update"
    :handleRemove="remove"
  />`,
  ...SelectTester
}))
