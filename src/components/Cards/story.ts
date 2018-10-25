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
      undos: []
    }
  },
  methods: {
    update(updates) {
      const self = this as any
      setTimeout(() => {
        self.cards = self.cards.map((card: CardInfo) => {
          updates.forEach((update: CardInfo) => {
            if (update.id === card.id) {
              card = { ...card, ...update }
            }
          })
          return card
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
      cardList.forEach((c: CardForm, i: number) => {
        setTimeout(() => {
          self.cards.push({ id: `key-${randomStr()}`, ...c })
        }, 50 * (i + 1))
      })
    },
    image(cardList) {
      const self = this as any
      cardList.forEach((c: CardForm, i: number) => {
        const { file, ...cd } = c
        setTimeout(() => {
          self.cards.push({
            ...cd,
            value: 'upload image will be shown',
            id: `key-${randomStr()}`
          })
        }, 50 * (i + 1))
      })
    },
    addUndo(action) {
      const self = this as any
      self.undos = self.undos.concat(action)
    },
    undo() {
      const self = this as any
      if (self.undos.length < 1) {
        return
      }
      const action = self.undos.pop()
      switch (action.type) {
        case 'DELETE_CARDS':
          self.remove(action.ids)
          return
        case 'UPDATE_CARDS':
          self.update(action.cards)
          return
        case 'ADD_CARDS':
          self.create(action.cards)
          return
      }
    },
    select() {}
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
    :handleSelect="select"
    :handleImage="image"
    :handleUndo="undo"
    :handleAddUndoActions="addUndo"
  />`,
  ...SelectTester
}))
