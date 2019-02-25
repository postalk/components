<template>
  <div
    class="canvas"
    @click="onClick"
    @mousedown.left.self="startSelect"
    @mousemove="openSelector"
    @mouseup.left="selectElement"
    @dblclick.exact="onDblClick"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <slot/>
    <div
      v-if="startX !== 0 || startY !== 0"
      class="selector"
      :style="{
        width: `${w}px`,
        height: `${h}px`,
        top: `${y}px`,
        left: `${x}px`
      }"
    />
    <div v-if="isDragging" class="dragfield"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Centered from '@/components/Centered/index.vue'
import { UNIT, CANVAS_WIDTH, CANVAS_HEIGHT } from '@/components/numbers'
import { getTransferredCards } from '@/components/Cards/utils'
import { CardForm } from '@/components/types'

@Component<CardCanvas>({
  components: {
    Centered
  },
  watch: {
    reseter(newVal, oldVal) {
      if (!oldVal && newVal) {
        this.startX = 0
        this.startY = 0
        this.x = 0
        this.y = 0
        this.w = 0
        this.h = 0
      }
    }
  }
})
export default class CardCanvas extends Vue {
  @Prop()
  private handleNew!: (x: number, y: number) => void
  @Prop()
  private handleCreate!: (cards: CardForm[]) => void
  @Prop()
  private handleCursor!: (x: number, y: number) => void
  @Prop()
  private handleSelect!: (ids: string[]) => void
  @Prop()
  private handleImage!: (file: File, x: number, y: number) => void
  @Prop()
  private moving!: boolean
  @Prop()
  private reseter!: boolean
  @Prop()
  private selectedCardIds!: string[]
  private startX: number = 0
  private startY: number = 0
  private w: number = 0
  private h: number = 0
  private x: number = 0
  private y: number = 0

  private isDragging: boolean = false

  private onDblClick(e: MouseEvent) {
    this.handleNew(e.offsetX, e.offsetY)
  }

  private onClick(e: MouseEvent) {
    const isDraggable = (e.target as Element).className.match(/drag/)

    if (isDraggable && !this.moving) {
      this.startX = 0
      this.startY = 0
      this.w = 0
      this.h = 0
      const clickedId = (((e.target as Element).parentElement as Element)
        .parentElement as Element).id

      if (!e.shiftKey) {
        this.handleSelect([clickedId])
        return
      }

      if (this.selectedCardIds.includes(clickedId)) {
        this.handleSelect(this.selectedCardIds.filter(id => id !== clickedId))
      } else {
        this.handleSelect([
          ...new Set([...this.selectedCardIds, ...[clickedId]])
        ])
      }
    }
  }

  private onDragOver(e: DragEvent): void {
    e.preventDefault()
    if (!e || !e.dataTransfer) {
      return
    }
    e.dataTransfer.dropEffect = 'copy'
    this.isDragging = true
  }

  private onDragLeave(e: DragEvent): void {
    this.isDragging = false
  }

  private onDrop(e: DragEvent): void {
    e.preventDefault()
    this.isDragging = false
    if (!e || !e.dataTransfer) {
      return
    }
    const files = e.dataTransfer.files
    let file

    if (files.length < 1) {
      const parser = new DOMParser()
      const includesSpan =
        !!e.dataTransfer.getData('text/html') &&
        parser
          .parseFromString(e.dataTransfer.getData('text/html'), 'text/html')
          .body.querySelectorAll('span').length > 0

      let trandferData

      switch (true) {
        case includesSpan:
          trandferData = e.dataTransfer.getData('text/html')
          break
        case !!e.dataTransfer.getData('text/uri-list'):
          trandferData = `<span>${e.dataTransfer.getData(
            'text/uri-list'
          )}<span>`
          break
        case !!e.dataTransfer.getData('text/plain'):
          trandferData = `<span>${e.dataTransfer.getData('text/plain')}<span>`
          break
      }
      if (!trandferData) {
        return
      }

      const spans = parser
        .parseFromString(trandferData, 'text/html')
        .body.querySelectorAll('span')

      if (spans.length < 1) {
        return
      }
      this.handleCreate(
        getTransferredCards(spans, { x: e.offsetX, y: e.offsetY })
      )
      return
    }

    // tslint:disable:prefer-for-of
    for (let i = 0; i < files.length; i++) {
      file = files[i]
      if (!file || file.type.indexOf('image/') < 0) {
        continue
      }
      const target = (e.currentTarget as any).getBoundingClientRect()
      const offsetX = e.clientX - target.left
      const offsetY = e.clientY - target.top
      this.handleImage(file, offsetX, offsetY)
    }
  }

  private startSelect(e: MouseEvent): void {
    this.startX = e.offsetX
    this.startY = e.offsetY
    this.x = e.offsetX
    this.y = e.offsetY
    this.w = 0
    this.h = 0
  }

  private openSelector(e: MouseEvent): void {
    if (!e.currentTarget) {
      return
    }
    const target = (e.currentTarget as any).getBoundingClientRect()
    const offsetX = e.clientX - target.left
    const offsetY = e.clientY - target.top
    this.handleCursor(offsetX, offsetY)
    if (this.startX === 0 && this.startY === 0) {
      return
    }
    if (
      offsetX < UNIT ||
      offsetY < UNIT ||
      offsetX > CANVAS_WIDTH * UNIT - UNIT ||
      offsetY > CANVAS_HEIGHT * UNIT - UNIT
    ) {
      this.selectElement(e)
    }
    this.w = Math.abs(this.startX - offsetX)
    this.h = Math.abs(this.startY - offsetY)

    if (offsetX < this.startX) {
      this.x = offsetX
    }
    if (offsetY < this.startY) {
      this.y = offsetY
    }
  }

  private selectElement(e: MouseEvent) {
    const isCanvas = (e.target as Element).className.match(/canvas/)
    if (
      (this.w === 0 &&
        this.h === 0 &&
        this.startY === 0 &&
        this.startX === 0 &&
        !isCanvas) ||
      (this.w === 0 && this.w === 0 && this.moving)
    ) {
      return
    }

    this.startX = 0
    this.startY = 0

    if (this.$children[0]) {
      const newIds = this.$children
        .filter(card => this.isSelected(card.$el as HTMLElement))
        .map(card => (card as any).id)
      if (!e.shiftKey) {
        this.handleSelect(newIds)
        return
      }
      this.handleSelect([...new Set([...this.selectedCardIds, ...newIds])])
    }
  }

  private isSelected(el: HTMLElement) {
    return (
      this.x <= el.offsetLeft + el.clientWidth &&
      this.x + this.w >= el.offsetLeft &&
      this.y <= el.offsetTop + el.clientHeight &&
      this.y + this.h >= el.offsetTop &&
      !el.className.match(/isImage/)
    )
  }
}
</script>

<style scoped lang="scss">
.canvas {
  margin-right: auto;
  margin-left: auto;
  margin-top: 2rem;
  margin-bottom: 2rem;
  position: relative;
  width: $CANVAS_WIDTH;
  height: $CANVAS_HEIGHT;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
  background-position: 20px 20px;
  background-color: #fff;
  background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23BBBBBB' d='M0 0h1v1H0z' fill-rule='evenodd'/%3E%3C/svg%3E");
}
.selector {
  z-index: $Z_SELECTOR;
  position: absolute;
  background: rgba(0, 0, 0, 0.2);
}
.dragfield {
  position: absolute;
  z-index: $Z_OVER;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.6);
  border: 3px dashed #00e6e6;
}
</style>