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
      self.cards = self.cards.map(
        (card: CardInfo) =>
          ids.includes(card.id) ? { ...card, ...update } : card
      )
    },
    remove(ids) {
      const self = this as any
      self.cards = self.cards.filter((card: CardInfo) => !ids.includes(card.id))
    },
    create(cardList) {
      const self = this as any
      cardList = cardList.map((c: CardForm) => ({
        ...c,
        id: `key-${randomStr()}`
      }))
      self.cards = self.cards.concat(cardList)
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
    :handleRemove="remove"
    :handleUndo="undo"
  />`,
  ...SelectTester
}))
