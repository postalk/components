<template>
  <div
    class="canvas"
    @mousedown.left.self="startSelect"
    @mousemove="openSelector"
    @mouseup.left="selectElement"
    @click="onClick"
    @dblclick.exact="onDblClick"
  >
    <Card
      v-for="card in cards"
      :key="card.id"
      :id="card.id"
      :value="card.value"
      :color="card.color"
      :initial="{ x: card.x, y: card.y }"
      :diff="{ x: diffX, y: diffY }"
      :movingId="moving"
      :selected="selectedCardIds.includes(card.id)"
      :handleMove="onMove"
      :handleStop="onStop"
      :handleStart="onStart"
      :handleUpdate="onUpdate"
      :handleRemove="onRemove"
      :handleSelect="onSelect"
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
    <div
      v-if="selectStartX !== 0 || selectStartY !== 0"
      class="selector"
      :style="{
        width: `${selectW}px`,
        height: `${selectH}px`,
        top: `${selectY}px`,
        left: `${selectX}px`
      }"
    />
    <Mark
      v-if="markerX !== 0 && markerY !== 0 && selectedCardIds.length === 0"
      :color="color"
      :x="markerX"
      :y="markerY"
      :handleText="createNewCard"
      :handleImage="createImageCard"
    />
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
      :onMoveMarker="moveMarker"
      :onColorMarker="colorMarker"
      :onClearMarker="clearMarker"
      :onCreateMarker="()=>{}"
    />
  </div>
</template>

<script lang="ts">
import isImage from 'is-image-url'
import { Component, Prop, Vue } from 'vue-property-decorator'
import Card from '../Card/index.vue'
import Shortcuts from '../Shortcuts/index.vue'
import { CardInfo, CardForm } from '@/components/types'
import {
  ua,
  width as windowWidth,
  height as windowHeight
} from '@/components/browser'
import { escapeHTML, nl2br } from '@/components/utils'
import Mark from './marker.vue'

interface CardInfoEx extends CardInfo {
  file: File
}

@Component<Cards>({
  components: {
    Card,
    Shortcuts,
    Mark
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
              deleteCardIds.push(c.id)
              this.selectedCardIds = [
                ...new Set([...this.selectedCardIds, ...[c.id]])
              ]
              return false
            }
            if (card.id && card.id === c.id && card.value !== c.value) {
              this.selectedCardIds = [
                ...new Set([...this.selectedCardIds, ...[c.id]])
              ]
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
      if (!newVal.every((e: string) => oldVal.includes(e))) {
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
  private handleUndo!: () => void
  @Prop()
  private handleAddUndoActions!: (
    actions: {
      type: string
      ids?: string[]
      cards?: Array<Partial<CardInfo>>
    }
  ) => void

  private newCard: Partial<CardInfo> = {}

  private diffX: number = 0
  private diffY: number = 0
  private moving: string = ''

  private selectStartX: number = 0
  private selectStartY: number = 0
  private selectW: number = 0
  private selectH: number = 0
  private selectX: number = 0
  private selectY: number = 0
  private selectedCardIds: string[] = []
  private willSelect: Array<Partial<CardInfoEx>> = []
  private willPositionClear: Array<Partial<CardInfo>> = []

  private markerX: number = 0
  private markerY: number = 0

  private cursorX: number = 0
  private cursorY: number = 0

  private color: string = 'white'

  private OFFSET = 20
  private GRID = 24
  private CARD_PADDING = 8

  private onClick(e: MouseEvent) {
    const isDraggable = (e.target as Element).className.match(/drag/)

    if (isDraggable && !this.moving) {
      this.selectStartX = 0
      this.selectStartY = 0
      this.selectW = 0
      this.selectH = 0
      const clickedId = (((e.target as Element).parentElement as Element)
        .parentElement as Element).id

      if (!e.shiftKey) {
        this.selectedCardIds = [clickedId]
        return
      }

      if (this.selectedCardIds.includes(clickedId)) {
        this.selectedCardIds = this.selectedCardIds.filter(
          id => id !== clickedId
        )
      } else {
        this.selectedCardIds = [
          ...new Set([...this.selectedCardIds, ...[clickedId]])
        ]
      }
    }
  }

  private onDblClick(e: MouseEvent) {
    this.markerX =
      Math.round((e.pageX - this.GRID) / this.GRID) * this.GRID + this.OFFSET
    this.markerY =
      Math.round((e.pageY - this.GRID) / this.GRID) * this.GRID + this.OFFSET
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

  private onStart(id: string): void {
    if (!this.selectedCardIds.includes(id)) {
      this.selectedCardIds = [id]
    }
    this.selectStartX = 0
    this.selectStartY = 0
    this.selectW = 0
    this.selectH = 0
  }

  private onUpdate(id: string, value: string): void {
    this.clearSelected()
    const selectedCard = this.cards.filter(card => card.id === id)[0]
    const cards = this.getMultipleCard(value)
    if (cards.length > 1) {
      this.handleUpdate([{ id, value: cards[0].value }])
      const payloads = cards.filter((card, i) => i !== 0).map(card => ({
        x: selectedCard.x || 0,
        y: selectedCard.y
          ? Math.floor((selectedCard.y + card.offset) / this.GRID) * this.GRID +
            this.OFFSET
          : 0,
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

  private onNewCardUpdate(id: string, value: string): void {
    const cards = this.getMultipleCard(value)
    const payloads = cards.map(card => ({
      x: this.newCard.x || 0,
      y: this.newCard.y
        ? Math.floor((this.newCard.y + card.offset) / this.GRID) * this.GRID +
          this.OFFSET
        : 0,
      value: card.value,
      color: this.newCard.color || '',
      author: this.author
    }))

    this.willSelect = payloads
    this.handleCreate(payloads)
    this.newCard = {}
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

  private onNewCardRemove(): void {
    this.newCard = {}
  }

  private getMultipleCard(
    text: string
  ): Array<{ offset: number; value: string }> {
    const cards: Array<{ offset: number; value: string }> = []
    const paragraphs = text.match(/[^\r\n]+((\r|\n|\r\n)[^\r\n]+)*/g)
    let offset = 0
    if (paragraphs) {
      paragraphs.forEach(p => {
        const testTxt = nl2br(escapeHTML(p))
        const test = document.createElement('div')
        test.className = 'calc-test-width'
        test.innerHTML = testTxt
        document.body.appendChild(test)
        const height = test.clientHeight
        document.body.removeChild(test)
        const brMatch = testTxt.match(/<br \/>/g)
        const paddingNum = brMatch ? brMatch.length + 1 : 1
        if (!!p && !!p.trim()) {
          cards.push({
            offset,
            value: p
          })
          offset += height + paddingNum * this.CARD_PADDING * 2 + paddingNum + 2
          /*
            font-size: 14
            line-height: 1.5
            padding top, bottom: 8
            border top, bottom: 1
            card's width = 222
          */
        }
      })
    } else {
      cards.push({
        offset,
        value: text
      })
    }
    return cards
  }

  private startSelect(e: MouseEvent): void {
    this.clearMarker()
    this.selectStartX = e.pageX
    this.selectStartY = e.pageY
    this.selectX = e.pageX
    this.selectY = e.pageY
    this.selectW = 0
    this.selectH = 0
  }

  private openSelector(e: MouseEvent): void {
    this.cursorX = e.pageX
    this.cursorY = e.pageY
    if (this.selectStartX === 0 && this.selectStartY === 0) {
      return
    }
    if (e.pageX < 10 || e.pageY < 10) {
      this.selectElement(e)
    }
    this.selectW = Math.abs(this.selectStartX - e.pageX)
    this.selectH = Math.abs(this.selectStartY - e.pageY)

    if (e.pageX < this.selectStartX) {
      this.selectX = e.pageX
    }
    if (e.pageY < this.selectStartY) {
      this.selectY = e.pageY
    }
  }

  private selectElement(e: MouseEvent) {
    const isCanvas = (e.target as Element).className.match(/canvas/)

    if (
      (this.selectW === 0 &&
        this.selectH === 0 &&
        this.selectStartY === 0 &&
        this.selectStartX === 0 &&
        !isCanvas) ||
      (this.selectW === 0 && this.selectW === 0 && this.moving)
    ) {
      return
    }

    this.selectStartX = 0
    this.selectStartY = 0

    if (this.$children.length && this.$children.length > 0) {
      const newIds = this.$children
        .filter(card => this.isSelected(card.$el))
        .map(card => (card as any).id)

      if (!e.shiftKey) {
        this.selectedCardIds = newIds
        return
      }

      this.selectedCardIds = [...new Set([...this.selectedCardIds, ...newIds])]
    }
  }

  private clearMarker() {
    this.markerX = 0
    this.markerY = 0
  }

  private colorMarker(color: string) {
    const colors = ['white', 'blue', 'yellow', 'red']
    const index = (colors.indexOf(this.color) + 1) % 4
    this.color = colors[index]
  }

  private createNewCard() {
    if (this.markerX === 0 || this.markerY === 0) {
      this.markerX =
        Math.floor(this.cursorX / this.GRID) * this.GRID + this.OFFSET
      this.markerY =
        Math.floor(this.cursorY / this.GRID) * this.GRID + this.OFFSET
      return
    }

    this.newCard = {
      x: this.markerX,
      y: this.markerY,
      color: this.color,
      author: this.author
    }
    this.clearMarker()
  }

  private createImageCard(file: File) {
    const card = {
      x: this.markerX,
      y: this.markerY,
      color: this.color,
      author: this.author,
      file
    }
    this.willSelect = [card]
    this.handleImage([card])
    this.clearSelected()
    this.clearMarker()
  }

  private changeColor(color: string): void {
    const colors = ['white', 'blue', 'yellow', 'red']
    const selectedCards = this.cards.filter(card =>
      this.selectedCardIds.includes(card.id)
    )
    const current = selectedCards[0].color
    const index = (colors.indexOf(current) + 1) % 4

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

  private selectAll() {
    this.selectedCardIds = this.cards.map(c => c.id)
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
    selectedCards.sort((a, b) => {
      if (a.x + a.y < b.x + b.y) {
        return -1
      }
      if (a.x + a.y > b.x + b.y) {
        return 1
      }
      return 0
    })

    const medianX =
      Math.floor(
        (selectedCards[selectedCards.length - 1].x + selectedCards[0].x) /
          (2 * this.GRID)
      ) * this.GRID
    const medianY =
      Math.floor(
        (selectedCards[selectedCards.length - 1].y + selectedCards[0].y) /
          (2 * this.GRID)
      ) * this.GRID

    e.clipboardData.setData(
      'text/plain',
      selectedCards.map(card => card.value).join('\n')
    )
    e.clipboardData.setData(
      'text/html',
      selectedCards
        .map(
          c =>
            `<span data-y="${c.y - medianY}" data-x="${c.x -
              medianX}" data-color="${c.color}">${c.value}</span>`
        )
        .join()
    )
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
    const cards = Array.prototype.slice
      .call(spans)
      .filter(
        (el: HTMLSpanElement) =>
          el.textContent && el.dataset.x && el.dataset.y && el.dataset.color
      )
      .map((el: HTMLSpanElement) => ({
        x:
          Math.floor(Math.floor(windowWidth() / 2) / this.GRID) * this.GRID +
          Number(el.dataset.x) -
          this.GRID * 5,
        y:
          Math.floor(Math.floor(windowHeight() / 2) / this.GRID) * this.GRID +
          Number(el.dataset.y) -
          this.GRID,
        color: el.dataset.color as string,
        value: el.textContent,
        author: this.author
      }))

    this.willSelect = cards
    this.clearMarker()
    this.clearSelected()
    this.handleCreate(cards)
  }

  private moveMarker(x: number, y: number) {
    if (this.markerX === 0 || this.markerY === 0) {
      return
    }
    this.markerX += x
    this.markerY += y
  }

  private isSelected(el: HTMLElement) {
    return (
      this.selectX <= el.offsetLeft + el.clientWidth &&
      this.selectX + this.selectW >= el.offsetLeft &&
      this.selectY <= el.offsetTop + el.clientHeight &&
      this.selectY + this.selectH >= el.offsetTop &&
      !el.className.match(/isImage/)
    )
  }
}
</script>

<style scoped lang="scss">
.canvas {
  min-height: 1200px;
  min-width: 2000px;
  width: 100%;
  height: 100%;
}

.selector {
  z-index: 5;
  position: absolute;
  background: rgba(0, 0, 0, 0.2);
}
</style>

<style>
.calc-test-width {
  font-size: 14px;
  position: absolute;
  visibility: hidden;
  height: auto;
  width: 222px;
  word-break: break-word;
  line-height: 1.5;
}
</style>