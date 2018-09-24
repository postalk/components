import { storiesOf } from '@storybook/vue'
import Cards from './index.vue'
import Vue, { ComponentOptions } from 'vue'
import { cards } from '../data'
import { CardInfo, CardForm } from '@/components/types'
import { randomStr } from '@/components/test'

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

      self.cards.push({
        id: 'new-' + randomStr(),
        x,
        y,
        value: '',
        color,
        author: 'me'
      })
    },
    create(cardList) {
      const self = this as any
      cardList = cardList.map((c: CardForm) => ({
        ...c,
        id: `key-${randomStr()}`
      }))
      self.cards = self.cards.concat(cardList)
    }
  }
}

storiesOf('Cards', module).add('Default', () => ({
  methods: {},
  template: `<Cards
    :cards="cards"
    :handleNew="newCard"
    :handleCreate="create"
    :handleStop="stop"
    :handleColor="color"
    :handleUpdate="update"
    :handleRemove="remove"
  />`,
  ...SelectTester
}))
