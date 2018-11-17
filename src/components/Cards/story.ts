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
      cards,
      disables: ['key3', 'key1'],
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
        }, 1000 * (i + 1))
      })
    },
    url(url: string, id: string) {
      const self = this as any
      setTimeout(() => {
        self.cards = self.cards.map((card: CardInfo) => {
          return card.id === id
            ? {
                ...card,
                url: `https://postalk.io`,
                html: `
<img class="url__favicon" src="https://d247fv9ioqt5ap.cloudfront.net/apple-touch-icon.png">
<span class="url__sitetitle">postalk</span>
<a class="url__title" href="https://postalk.io" target="_blank">postalk | オンラインの議論を加速させるカード型チャットツール</a>
<div class="url__description">postalk はカードを並べてコミュケーションができるオンラインツールです。リモートワークでの遠隔ミーティング・画像を使った議論などに最適です。</div>
<img class="url__img" src="https://d247fv9ioqt5ap.cloudfront.net/images/ogimage.png">
                `
              }
            : card
        })
      }, 100)
    },
    addUndo(undoAction) {
      const self = this as any
      self.undos = self.undos.concat(undoAction)
    },
    undo() {
      const self = this as any
      if (self.undos.length < 1) {
        return
      }
      const undoAction = self.undos.pop()
      switch (undoAction.type) {
        case 'DELETE_CARDS':
          self.remove(undoAction.ids)
          return
        case 'UPDATE_CARDS':
          self.update(undoAction.cards)
          return
        case 'ADD_CARDS':
          self.create(undoAction.cards)
          return
      }
    },
    select: action('select')
  }
}

storiesOf('Cards', module).add('Default', () => ({
  methods: {},
  template: `<Cards
    :disableIds="disables"
    :cards="cards"
    author="me"
    :handleCreate="create"
    :handleUpdate="update"
    :handleRemove="remove"
    :handleSelect="select"
    :handleImage="image"
    :handleURL="url"
    :handleUndo="undo"
    :handleAddUndoActions="addUndo"
  />`,
  ...SelectTester
}))
