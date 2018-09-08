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
    color(ids, color) {
      const self = this as any
      self.cards = self.cards.map(
        (card: CardInfo) =>
          ids.includes(card.id)
            ? {
                ...card,
                color
              }
            : card
      )
    },
    update(id, value) {
      const self = this as any
      self.cards = self.cards.map((card: CardInfo) => {
        if (card.id === id) {
          return id.match(/^new\-/)
            ? {
                ...card,
                id: 'key' + self.cards.length,
                value
              }
            : { ...card, value }
        }
        return card
      })
    },
    remove(ids) {
      const self = this as any
      self.cards = self.cards.filter((card: CardInfo) => !ids.includes(card.id))
    },
    newCard(x, y, color) {
      const self = this as any

      self.cards = self.cards.filter(
        (card: CardInfo) => !card.id.match(/^new\-/)
      )

      const c = 'abcdefghijklmnopqrstuvwxyz0123456789'
      let r = ''
      for (let i = 0; i < 8; i++) {
        r += c[Math.floor(Math.random() * c.length)]
      }

      self.cards.push({
        id: 'new-' + r,
        x,
        y,
        value: '',
        color
      })
    }
  }
}

storiesOf('Cards', module).add('Default', () => ({
  methods: {},
  template: `<Cards
    :cards="cards"
    :handleNew="newCard"
    :handleStop="stop"
    :handleColor="color"
    :handleUpdate="update"
    :handleRemove="remove"
  />`,
  ...SelectTester
}))
