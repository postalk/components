<template>
  <div
    class="canvas"
    @mousedown.left="startSelect"
    @mousemove="openSelector"
    @mouseup="selectElement"
    @click="onClick"
  >
    <Card
      v-for="card in cards"
      :key="card.id"
      :id="card.id"
      :value="card.value"
      :color="card.color"
      :initialX="card.x"
      :initialY="card.y"
      :diffX="diffX"
      :diffY="diffY"
      :moving="moving"
      :selected="selectedCardIds.includes(card.id)"
      :disabled="(selectStartX !== 0 || selectStartY !== 0) && (selectW > 0 && selectH > 0)"
      :handleMove="onMove"
      :handleStop="onStop"
      :handleStart="onStart"
      :handleUpdate="onUpdate"
      :handleRemove="onRemove"
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
    <div
      v-if="markerX !== 0 && markerY !== 0"
      :class="`marker ${color}`"
      :style="{
        top: `${markerY}px`,
        left: `${markerX}px`
      }"
    />
    <Shortcuts
      :selectedIds="selectedCardIds"
      :onClearSelected="clearSelected"
      :onRemoveSelected="removeSelected"
      :onMoveSelected="()=>{}"
      :onChangeColor="changeColor"
      :onSelectAll="selectAll"
      :onUndo="()=>{}"
      :onNewCard="newCard"
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
import { CardInfo } from '@/components/types'

@Component<Cards>({
  components: {
    Card,
    Shortcuts
  }
})
export default class Cards extends Vue {
  @Prop({ default: [] })
  private cards!: CardInfo[]

  @Prop() private handleNew!: (x: number, y: number, color: string) => void
  @Prop()
  private handleStop!: (
    updateCardIds: string[],
    diffX: number,
    diffY: number
  ) => void
  @Prop() private handleColor!: (updateCardIds: string[], color: string) => void
  @Prop() private handleUpdate!: (id: string, value: string) => void
  @Prop() private handleRemove!: (ids: string[]) => void

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

  private markerX: number = 0
  private markerY: number = 0

  private color: string = 'white'

  private onClick(e: MouseEvent) {
    const isDraggable = (e.target as Element).className.match(/drag/)
    if (isDraggable) {
      const id = (((e.target as Element).parentElement as Element)
        .parentElement as Element).id
      this.selectedCardIds = [id]
    }
  }

  private onMove(x: number, y: number, key: string): void {
    this.diffX -= x
    this.diffY -= y
    this.moving = key
  }

  private onStop(): void {
    this.handleStop(this.selectedCardIds, this.diffX, this.diffY)

    this.diffX = 0
    this.diffY = 0
    this.moving = ''
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
    this.handleUpdate(id, value)
  }

  private onRemove(id: string): void {
    this.handleRemove([id])
  }

  private startSelect(e: MouseEvent): void {
    const isCanvas =
      e && e.target && (e.target as Element).className.match(/canvas/)
    if (!isCanvas) {
      return
    }
    this.clearMarker()
    this.selectStartX = e.pageX
    this.selectStartY = e.pageY
    this.selectX = e.pageX
    this.selectY = e.pageY
    this.selectW = 0
    this.selectH = 0
  }

  private openSelector(e: MouseEvent): void {
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
      this.selectW === 0 &&
      this.selectH === 0 &&
      this.selectStartY === 0 &&
      this.selectStartX === 0 &&
      !isCanvas
    ) {
      return
    }

    if (this.selectW < 5 && this.selectH < 5 && isCanvas) {
      this.markerX = Math.round(e.pageX / 24) * 24 + 8
      this.markerY = Math.round(e.pageY / 24) * 24 + 8
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
    this.markerX =
      Math.floor((window.innerWidth - 16 * 6) / 10 * x / 24) * 24 + 8
    this.markerY =
      Math.floor((window.innerHeight - 7 * 3) / 4 * y / 24) * 24 + 8
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

  private newCard() {
    if (this.markerX === 0 || this.markerY === 0) {
      return
    }
    this.handleNew(this.markerX, this.markerY, this.color)
    this.clearMarker()
  }

  private changeColor(color: string): void {
    this.handleColor(this.selectedCardIds, color)
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
      this.selectY + this.selectH >= el.offsetTop
    )
  }
}
</script>

<style scoped lang="scss">
.canvas {
  width: 100%;
  height: 100%;
}

.selector {
  position: absolute;
  background: rgba(0, 0, 0, 0.2);
}

.marker {
  width: 12rem;
  height: 7rem;
  position: absolute;
  overflow: hidden;
  border: 4px solid rgba(#d8d8d8, 0.5);
  box-shadow: 0 0 0 0 rgba(#d8d8d8, 0.5);
  animation: pulse 0.6s infinite;
  &.blue {
    border-color: rgba(#8ee8e8, 0.5);
    box-shadow: 0 0 0 0 rgba(#8ee8e8, 0.5);
    animation: bluepulse 0.6s infinite;
  }
  &.yellow {
    border-color: rgba(#f9f116, 0.5);
    box-shadow: 0 0 0 0 rgba(#f9f116, 0.5);
    animation: yellowpulse 0.6s infinite;
  }
  &.red {
    border-color: rgba(#f39393, 0.5);
    box-shadow: 0 0 0 0 rgba(#f39393, 0.5);
    animation: redpulse 0.6s infinite;
  }
}

@keyframes pulse {
  0% {
  }
  99% {
    box-shadow: 0 0 0 8px rgba(#d8d8d8, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(#d8d8d8, 0);
  }
}

@keyframes bluepulse {
  0% {
  }
  99% {
    box-shadow: 0 0 0 8px rgba(#8ee8e8, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(#8ee8e8, 0);
  }
}

@keyframes yellowpulse {
  0% {
  }
  99% {
    box-shadow: 0 0 0 8px rgba(#f9f116, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(#f9f116, 0);
  }
}

@keyframes redpulse {
  0% {
  }
  99% {
    box-shadow: 0 0 0 8px rgba(#f39393, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(#f39393, 0);
  }
}
</style>