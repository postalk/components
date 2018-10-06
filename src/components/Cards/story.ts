import { storiesOf } from '@storybook/vue'
import Cards from './index.vue'
import Vue, { ComponentOptions } from 'vue'
import { cards } from '../data'
import { CardInfo, CardForm } from '@/components/types'
import { randomStr } from '@/components/test'
import { action } from '@storybook/addon-actions'

const SelectTester: ComponentOptions<Vue> = {
  components: { Cards },
  data: () => {
    return {
      cards
    }
  },
  methods: {
    update(ids, update) {
      const self = this as any
      setTimeout(() => {
        self.cards = self.cards.map(
          (card: CardInfo) =>
            ids.includes(card.id) ? { ...card, ...update } : card
        )
      }, 100)
    },
    positionUpdate(ids, diff) {
      const self = this as any
      setTimeout(() => {
        self.cards = self.cards.map((card: CardInfo) => {
          return ids.includes(card.id)
            ? { ...card, x: card.x + diff.x, y: card.y + diff.y }
            : card
        })
      }, 100)
    },
    remove(ids) {
      const self = this as any
      setTimeout(() => {
        self.cards = self.cards.filter(
          (card: CardInfo) => !ids.includes(card.id)
        )
      }, 100)
    },
    create(cardList) {
      const self = this as any
      cardList = cardList.map((c: CardForm) => ({
        ...c,
        id: `key-${randomStr()}`
      }))
      setTimeout(() => {
        self.cards = self.cards.concat(cardList)
      }, 100)
    },
    undo() {
      action('undo')
    }
  }
}

storiesOf('Cards', module).add('Default', () => ({
  methods: {},
  template: `<Cards
    :cards="cards"
    author="me"
    :handleCreate="create"
    :handleUpdate="update"
    :handlePositionUpdate="positionUpdate"
    :handleRemove="remove"
    :handleUndo="undo"
  />`,
  ...SelectTester
}))
