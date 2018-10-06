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
      :disabled="(selectStartX !== 0 || selectStartY !== 0) && (selectW > 0 && selectH > 0)"
      :handleMove="onMove"
      :handleStop="onStop"
      :handleStart="onStart"
      :handleUpdate="onUpdate"
      :handleRemove="onRemove"
    />
    <Card
      v-if="newCard.color !== undefined"
      id="new"
      :color="newCard.color"
      :initial="{ x: newCard.x, y: newCard.y }"
      :diff="{ x: diffX, y: diffY }"
      :movingId="moving"
      :selected="selectedCardIds.includes('new')"
      :disabled="(selectStartX !== 0 || selectStartY !== 0) && (selectW > 0 && selectH > 0)"
      :handleMove="onMove"
      :handleStop="onStop"
      :handleStart="onStart"
      :handleUpdate="onNewCardUpdate"
      :handleRemove="onNewCardRemove"
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
      :onCreateMarker="createMarker"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Card from '../Card/index.vue'
import Shortcuts from '../Shortcuts/index.vue'
import { CardInfo, CardForm } from '@/components/types'
import {
  ua,
  width as windowWidth,
  height as windowHeight
} from '@/components/browser'
import Mark from './marker.vue'

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
        this.selectedCardIds = []

        newVal.forEach((c: CardInfo, i: number) => {
          this.willSelect = this.willSelect.filter(card => {
            if (
              (card.id && card.id === c.id && card.value !== c.value) ||
              (!card.id &&
                card.value === c.value &&
                card.x === c.x &&
                card.y === c.y)
            ) {
              this.selectedCardIds.push(c.id)
              return false
            }
            return true
          })
        })
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
  private handleUpdate!: (ids: string[], cards: Partial<CardInfo>) => void
  @Prop()
  private handlePositionUpdate!: (
    ids: string[],
    diff: { x: number; y: number }
  ) => void
  @Prop()
  private handleRemove!: (ids: string[]) => void
  @Prop()
  private handleCreate!: (cards: CardForm[]) => void
  @Prop()
  private handleUndo!: () => void

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
  private willSelect: Array<Partial<CardInfo>> = []
  private willPositionClear: Array<Partial<CardInfo>> = []

  private markerX: number = 0
  private markerY: number = 0

  private cursorX: number = 0
  private cursorY: number = 0

  private color: string = 'white'

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

      this.selectedCardIds = this.selectedCardIds
        .concat([clickedId])
        .filter((id, i, self) => self.indexOf(id) === i)
    }
  }

  private onDblClick(e: MouseEvent) {
    this.markerX = Math.round((e.pageX - 12) / 24) * 24 + 8
    this.markerY = Math.round((e.pageY - 12) / 24) * 24 + 8
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

    this.willPositionClear = this.cards.filter(card =>
      this.selectedCardIds.includes(card.id)
    )
    this.handlePositionUpdate(this.selectedCardIds, {
      x: this.diffX,
      y: this.diffY
    })
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
    const prevVal = this.cards.filter(card => card.id === id)[0].value
    this.willSelect = [{ id, value: prevVal }]
    this.handleUpdate([id], { value })
  }

  private onNewCardUpdate(id: string, value: string): void {
    const payload = {
      x: this.newCard.x || 0,
      y: this.newCard.y || 0,
      value,
      color: this.newCard.color || '',
      author: this.author
    }
    this.willSelect = [payload]
    this.handleCreate([payload])
    this.newCard = {}
  }

  private onRemove(id: string): void {
    this.handleRemove([id])
  }

  private onNewCardRemove(): void {
    this.newCard = {}
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

      this.selectedCardIds = this.selectedCardIds
        .concat(newIds)
        .filter((id, i, self) => self.indexOf(id) === i)
    }
  }

  private createMarker(x: number, y: number) {
    this.selectedCardIds = []
    const willX =
      Math.floor((((windowWidth() - 16 * 6) / 10) * x) / 24) * 24 + 8
    const willY = Math.floor((((windowHeight() - 7 * 3) / 4) * y) / 24) * 24 + 8
    if (this.markerX === willX && this.markerY === willY) {
      this.createNewCard()
      return
    }
    this.markerX = willX
    this.markerY = willY
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
      this.markerX = Math.floor(this.cursorX / 24) * 24 + 8
      this.markerY = Math.floor(this.cursorY / 24) * 24 + 8
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

  private createImageCard(url: string) {
    this.handleCreate([
      {
        x: this.markerX,
        y: this.markerY,
        color: this.color,
        value: url as string,
        author: this.author
      }
    ])
    this.clearMarker()
  }

  private changeColor(color: string): void {
    if (color) {
      this.handleUpdate(this.selectedCardIds, { color })
      return
    }
    const colors = ['white', 'blue', 'yellow', 'red']
    const current = this.cards.filter(card =>
      this.selectedCardIds.includes(card.id)
    )[0].color
    const index = (colors.indexOf(current) + 1) % 4
    this.handleUpdate(this.selectedCardIds, {
      color: colors[index]
    })
  }

  private removeSelected() {
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
          (2 * 24)
      ) * 24
    const medianY =
      Math.floor(
        (selectedCards[selectedCards.length - 1].y + selectedCards[0].y) /
          (2 * 24)
      ) * 24

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
          Math.floor(Math.floor(windowWidth() / 2) / 24) * 24 +
          Number(el.dataset.x) -
          24 * 5,
        y:
          Math.floor(Math.floor(windowHeight() / 2) / 24) * 24 +
          Number(el.dataset.y) -
          24,
        color: el.dataset.color as string,
        value: el.textContent,
        author: this.author
      }))

    this.willSelect = cards
    this.handleCreate(cards)
    this.clearMarker()
    this.clearSelected()
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
  position: absolute;
  background: rgba(0, 0, 0, 0.2);
}
</style>