<template>
  <div class="board">
    <CardCanvas
      :handleCursor="saveCursor"
      :handleNew="createNewCard"
      :handleCreate="createCards"
      :handleSelect="updateSelectIds"
      :handleImage="createImageCard"
      :selectedCardIds="selectedCardIds"
      :moving="moving"
      :reseter="selectReseter"
    >
      <Card
        v-for="card in cards"
        :key="card.id"
        :id="card.id"
        :value="card.value"
        :color="card.color"
        :html="card.html"
        :url="card.url"
        :initial="{ x: card.x, y: card.y }"
        :diff="{ x: diffX, y: diffY }"
        :movingId="moving"
        :selected="selectedCardIds.includes(card.id)"
        :disabled="disableIds.includes(card.id)"
        :handleMove="onMove"
        :handleStop="onStop"
        :handleStart="onStart"
        :handleUpdate="onUpdate"
        :handleRemove="onRemove"
        :handleSelect="onSelect"
        :handleURL="handleURL"
      />
      <Card
        v-if="newCard.color !== undefined"
        id="new"
        :color="newCard.color"
        :initial="{ x: newCard.x, y: newCard.y }"
        :diff="{ x: diffX, y: diffY }"
        :movingId="moving"
        :selected="selectedCardIds.includes('new')"
        :handleMove="onMove"
        :handleStop="onStop"
        :handleStart="onStart"
        :handleUpdate="onNewCardUpdate"
        :handleRemove="onNewCardRemove"
        :handleSelect="onSelect"
      />
    </CardCanvas>
    <Shortcuts
      :selectedIds="selectedCardIds"
      :onClearSelected="clearSelected"
      :onRemoveSelected="removeSelected"
      :onMoveSelected="onMove"
      :onMoveDoneSelected="onStop"
      :onChangeColor="changeColor"
      :onSelectAll="selectAll"
      :onUndo="handleUndo"
      :onCopy="copy"
      :onPaste="paste"
      :onNewCard="createNewCard"
    />
    <div v-if="uploading" class="uploading">
      <Centered>
        <div class="loader">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </Centered>
    </div>
  </div>
</template>

<script lang="ts">
import isImage from 'is-image-url'
import { Component, Prop, Vue } from 'vue-property-decorator'
import Card from '../Card/index.vue'
import Shortcuts from '../Shortcuts/index.vue'
import CardCanvas from './canvas.vue'
import Centered from '@/components/Centered/index.vue'
import { CardInfo, CardForm } from '@/components/types'
import { copyCards, getTransferredCards, getMultipleCards } from './utils'
import { grid } from '@/components/utils'
import { OFFSET } from '@/components/numbers'

interface CardInfoEx extends CardInfo {
  file: File
}

@Component<Cards>({
  components: {
    Card,
    CardCanvas,
    Centered,
    Shortcuts
  },
  watch: {
    cards(newVal, oldVal) {
      if (this.willPositionClear.length > 0) {
        newVal.forEach((c: CardInfo, i: number) => {
          this.willPositionClear = this.willPositionClear.filter(
            card => !(card.id === c.id && (card.x !== c.x || card.y !== c.y))
          )
        })
        if (this.willPositionClear.length === 0) {
          this.moving = ''
          this.diffX = 0
          this.diffY = 0
        }
      }

      if (this.willSelect.length > 0) {
        const deleteCardIds: string[] = []
        newVal.forEach((c: CardInfo, i: number) => {
          this.willSelect = this.willSelect.filter(card => {
            if (
              !card.id &&
              (card.value === c.value || card.file) &&
              card.color === c.color &&
              card.x === c.x &&
              card.y === c.y
            ) {
              this.uploading = false
              deleteCardIds.push(c.id)
              this.selectedCardIds = [
                ...new Set([...this.selectedCardIds, ...[c.id]])
              ].filter(id => !this.disableIds.includes(id))
              return false
            }
            if (card.id && card.id === c.id && card.value !== c.value) {
              this.selectedCardIds = [
                ...new Set([...this.selectedCardIds, ...[c.id]])
              ].filter(id => !this.disableIds.includes(id))
              return false
            }
            return true
          })
        })
        if (deleteCardIds.length > 0) {
          this.handleAddUndoActions({
            type: 'DELETE_CARDS',
            ids: deleteCardIds
          })
        }
      }
    },
    selectedCardIds(newVal, oldVal) {
      if (
        !newVal.every((e: string) => oldVal.includes(e)) ||
        !oldVal.every((e: string) => newVal.includes(e))
      ) {
        this.handleSelect(newVal)
      }
    }
  }
})
export default class Cards extends Vue {
  @Prop({ default: [] })
  private cards!: CardInfo[]
  @Prop({ default: '' })
  private author!: string
  @Prop({ default: [] })
  private disableIds!: string[]

  @Prop()
  private handleUpdate!: (cards: Array<Partial<CardInfo>>) => void
  @Prop()
  private handleRemove!: (ids: string[]) => void
  @Prop()
  private handleCreate!: (cards: CardForm[]) => void
  @Prop()
  private handleSelect!: (ids: string[]) => void
  @Prop()
  private handleImage!: (cards: CardForm[]) => void
  @Prop()
  private handleURL!: (url: string, id: string) => void
  @Prop()
  private handleUndo!: () => void
  @Prop()
  private handleAddUndoActions!: (actions: {
    type: string
    ids?: string[]
    cards?: Array<Partial<CardInfo>>
  }) => void

  private newCard: Partial<CardInfo> = {}

  private diffX: number = 0
  private diffY: number = 0
  private moving: string = ''

  private selectedCardIds: string[] = []
  private willSelect: Array<Partial<CardInfoEx>> = []
  private willPositionClear: Array<Partial<CardInfo>> = []

  private cursorX: number = 0
  private cursorY: number = 0

  private selectReseter: boolean = false
  private uploading: boolean = false

  /*
   * Board
   **/

  private saveCursor(x: number, y: number): void {
    this.cursorX = x
    this.cursorY = y
  }

  private updateSelectIds(ids: string[]): void {
    this.selectedCardIds = ids.filter(id => !this.disableIds.includes(id))
  }

  private createImageCard(file: File, x: number, y: number) {
    const card = {
      x: grid(x),
      y: grid(y),
      color: 'white',
      author: this.author,
      file
    }
    this.willSelect = [card]
    this.handleImage([card])
    this.clearSelected()
    this.uploading = true
  }

  private createCards(cards: CardForm[]) {
    cards = cards.map(c => ({
      ...c,
      author: this.author
    }))

    this.willSelect = cards
    this.clearSelected()
    this.handleCreate(cards)
  }

  /*
   *  A card
   **/

  private onStart(id: string): void {
    if (!this.selectedCardIds.includes(id)) {
      this.selectedCardIds = [id]
    }
    this.selectReseter = true
    this.$nextTick(() => {
      this.selectReseter = false
    })
  }

  private onMove(x: number, y: number, key: string): void {
    this.diffX -= x
    this.diffY -= y
    this.moving = key
  }

  private onStop(): void {
    if (this.diffX === 0 && this.diffY === 0) {
      this.moving = ''
      return
    }

    const selectedCards = this.cards.filter(card =>
      this.selectedCardIds.includes(card.id)
    )
    this.willPositionClear = selectedCards
    const updates = selectedCards.map(card => ({
      id: card.id,
      x: card.x + this.diffX,
      y: card.y + this.diffY
    }))

    this.handleAddUndoActions({
      type: 'UPDATE_CARDS',
      cards: selectedCards.map(card => ({
        id: card.id,
        x: card.x,
        y: card.y
      }))
    })
    this.handleUpdate(updates)
  }

  private onUpdate(id: string, value: string): void {
    this.clearSelected()
    const selectedCard = this.cards.filter(card => card.id === id)[0]
    const cards = getMultipleCards(value)
    if (cards.length > 1) {
      this.handleUpdate([{ id, value: cards[0].value }])
      const payloads = cards
        .filter((card, i) => i !== 0)
        .map(card => ({
          x: selectedCard.x || 0,
          y: selectedCard.y ? grid(selectedCard.y + card.offset) : 0,
          value: card.value,
          color: selectedCard.color || '',
          author: this.author
        }))
      this.willSelect = payloads
      this.handleCreate(payloads)
    } else {
      this.handleUpdate([{ id, value }])
    }
    const prevVal = selectedCard.value
    this.willSelect = this.willSelect.concat([{ id, value: prevVal }])
    this.handleAddUndoActions({
      type: 'UPDATE_CARDS',
      cards: [{ id, value: prevVal }]
    })
  }

  private onRemove(id: string): void {
    const selectedCards = this.cards.filter(card => card.id === id)
    this.handleAddUndoActions({
      type: 'ADD_CARDS',
      cards: selectedCards
    })
    this.handleRemove([id])
  }

  private onSelect(id: string): void {
    this.selectedCardIds = [id]
  }

  /*
   * A new card
   **/

  private createNewCard(x?: number, y?: number) {
    x = x || this.cursorX
    y = y || this.cursorY
    this.newCard = {
      x: grid(x - OFFSET / 2),
      y: grid(y - OFFSET / 2),
      color: 'white',
      author: this.author
    }
  }

  private onNewCardUpdate(id: string, value: string): void {
    const cards = getMultipleCards(value)
    const payloads = cards.map(card => ({
      x: this.newCard.x || 0,
      y: this.newCard.y ? grid(this.newCard.y + card.offset) : 0,
      value: card.value,
      color: this.newCard.color || '',
      author: this.author
    }))

    this.willSelect = payloads
    this.handleCreate(payloads)
    this.newCard = {}
  }

  private onNewCardRemove(): void {
    this.newCard = {}
  }

  /*
   * Selected cards
   **/

  private changeColor(color: string): void {
    const colors = ['white', 'offwhite', 'red', 'yellow', 'blue']
    const selectedCards = this.cards.filter(card =>
      this.selectedCardIds.includes(card.id)
    )
    const current = selectedCards[0].color
    const index = (colors.indexOf(current) + 1) % colors.length

    const updates = this.selectedCardIds.map(id => ({
      id,
      color: colors[index]
    }))

    this.handleAddUndoActions({
      type: 'UPDATE_CARDS',
      cards: selectedCards.map(card => ({
        id: card.id,
        color: card.color
      }))
    })
    this.handleUpdate(updates)
  }

  private removeSelected() {
    const selectedCards = this.cards.filter(card =>
      this.selectedCardIds.includes(card.id)
    )
    this.handleAddUndoActions({
      type: 'ADD_CARDS',
      cards: selectedCards
    })
    this.handleRemove(this.selectedCardIds)
  }

  /*
   * Shortcuts
   **/

  private selectAll() {
    this.selectedCardIds = this.cards
      .map(c => c.id)
      .filter(id => !this.disableIds.includes(id))
  }

  private clearSelected() {
    this.selectedCardIds = []
  }

  private copy(e: ClipboardEvent) {
    if (!e.clipboardData) {
      return
    }
    const selectedCards = this.cards.filter(card =>
      this.selectedCardIds.includes(card.id)
    )
    copyCards(e, selectedCards)
  }

  private paste(e: ClipboardEvent) {
    const html = e.clipboardData.getData('text/html')
    if (!html) {
      return
    }
    const parser = new DOMParser()
    const spans = parser
      .parseFromString(html, 'text/html')
      .body.querySelectorAll('span')
    if (spans.length < 1) {
      return
    }
    const cards = getTransferredCards(spans).map(c => ({
      ...c,
      author: this.author
    }))

    this.willSelect = cards
    this.clearSelected()
    this.handleCreate(cards)
  }
}
</script>

<style scoped lang="scss">
.board {
  width: 100%;
  height: 100%;
}
.uploading {
  position: absolute;
  z-index: $Z_OVER;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.6);
}
.loader {
  position: relative;
}
.loader span {
  position: absolute;
  width: 20px;
  height: 20px;
  background: #00e6e6;
  opacity: $DISABLED_OPACITY;
  border-radius: 20px;
  animation: loader 1s infinite ease-in-out;
}
.loader span:nth-child(2) {
  left: 20px;
  animation-delay: 0.2s;
}
.loader span:nth-child(3) {
  left: 40px;
  animation-delay: 0.4s;
}
.loader span:nth-child(4) {
  left: 60px;
  animation-delay: 0.6s;
}
.loader span:nth-child(5) {
  left: 80px;
  animation-delay: 0.8s;
}
@keyframes loader {
  0% {
    opacity: 0.3;
    transform: translateY(0px);
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.1);
  }
  50% {
    opacity: 1;
    transform: translateY(-10px);
    background: #fff500;
    box-shadow: 0px 20px 3px rgba(0, 0, 0, 0.05);
  }
  100% {
    opacity: 0.3;
    transform: translateY(0px);
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.1);
  }
}
</style>

<style lang="scss">
.calc-text-width {
  font-size: $TEXT;
  position: absolute;
  visibility: hidden;
  height: auto;
  width: calc(#{$CARD_WIDTH} - #{$PADDING} * 2 - #{$BORDER_WIDTH} * 2);
  word-break: break-word;
  line-height: $LINE_HEIGHT;
}
</style>