<template>
  <div
    class="canvas"
    @mousedown.left="startSelect"
    @mousemove="openSelector"
    @mouseup="selectElement"
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
      class="marker"
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
      :onChangeColor="()=>{}"
      :onSelectAll="selectAll"
      :onUndo="()=>{}"
      :onNewCard="newCard"
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

  @Prop() private handleNew!: (x: number, y: number) => void
  @Prop()
  private handleStop!: (
    updateCardIds: string[],
    diffX: number,
    diffY: number
  ) => void
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
    const isCanvas =
      e && e.target && (e.target as Element).className.match(/canvas/)
    if (
      !(
        this.selectW === 0 &&
        this.selectH === 0 &&
        this.selectStartY === 0 &&
        this.selectStartX === 0
      ) ||
      isCanvas
    ) {
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
  }

  private createMarker({ top, left }: { top: number; left: number }) {
    this.selectedCardIds = []
    this.markerX =
      Math.floor((window.innerWidth - 16 * 6) / 10 * left / 24) * 24 + 8
    this.markerY =
      Math.floor((window.innerHeight - 7 * 3) / 4 * top / 24) * 24 + 8
  }

  private clearMarker() {
    this.markerX = 0
    this.markerY = 0
  }

  private newCard() {
    if (this.markerX === 0 || this.markerY === 0) {
      return
    }
    this.handleNew(this.markerX, this.markerY)
    this.clearMarker()
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
  border: 4px solid rgba(#c3d8dd, 0.5);
  box-shadow: 0 0 0 0 rgba(#c3d8dd, 0.5);
  animation: pulse 0.6s infinite;
}

@keyframes pulse {
  0% {
  }
  99% {
    box-shadow: 0 0 0 8px rgba(#c3d8dd, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(#c3d8dd, 0);
  }
}
</style>