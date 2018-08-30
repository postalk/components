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
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Card from '../Card/index.vue'
import { CardInfo } from '@/components/types'

@Component<Cards>({
  components: {
    Card
  }
})
export default class Cards extends Vue {
  @Prop({ default: [] })
  private cards!: CardInfo[]

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

  private onMove(x: number, y: number, key: string): void {
    this.diffX -= x
    this.diffY -= y
    this.moving = key
  }

  private onStop(): void {
    this.diffX = 0
    this.diffY = 0
    this.moving = ''
  }

  private onStart(id: string): void {
    if (!this.selectedCardIds.includes(id)) {
      this.selectedCardIds = [id]
      this.selectStartX = 0
      this.selectStartY = 0
      this.selectW = 0
      this.selectH = 0
    }
  }

  private startSelect(e: MouseEvent): void {
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
    const isCanvasMouseUp =
      e && e.target && (e.target as Element).className.match(/canvas/)
    if (
      !(
        this.selectW === 0 &&
        this.selectH === 0 &&
        this.selectStartY === 0 &&
        this.selectStartX === 0
      ) ||
      isCanvasMouseUp
    ) {
      this.selectStartX = 0
      this.selectStartY = 0

      if (this.$children.length && this.$children.length > 0) {
        const newIds = this.$children
          .filter(card => {
            return this.isSelected(card.$el)
          })
          .map(card => (card as any).id)

        if (!e.shiftKey) {
          this.selectedCardIds = newIds
          return
        }

        this.selectedCardIds = this.selectedCardIds
          .concat(newIds)
          .filter(function(id, i, self) {
            return self.indexOf(id) === i
          })
      }
    }
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
</style>