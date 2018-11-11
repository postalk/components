<template>
  <VueDraggableResizable 
    :class="{
      draggable: true,
      isDragging: dragging
    }"
    :style="{
      transform: `translate(${-1 * x}px,${-1 * y}px)`
    }"
    v-if="width > 0 && height > 0"
    :resizable="false"
    :grid="[GRID,GRID]"
    :x="x - DRAG_WIDTH"
    :y="y - DRAG_WIDTH"
    @dragging="onMove"
    @dragstop="onStop"
    drag-handle=".drag"
  >
  <div 
    class="drag top"
    :style="{
      width: `${width}px`,
      height: `${DRAG_WIDTH + OVERRAPPING}px`
    }"
  />
  <div 
    class="drag bottm"
    :style="{
      top: `${height - DRAG_WIDTH - OVERRAPPING}px`,
      width: `${width}px`,
      height: `${DRAG_WIDTH + OVERRAPPING}px`
    }"
  />
  <div 
    class="drag left"
    :style="{
      top: `${DRAG_WIDTH + OVERRAPPING}px`,
      width: `${DRAG_WIDTH + OVERRAPPING}px`,
      height: `${height - DRAG_WIDTH * 2 - OVERRAPPING * 2}px`
    }"
  />
  <div 
    class="drag right"
    :style="{
      top: `${DRAG_WIDTH + OVERRAPPING}px`,
      left: `${width - DRAG_WIDTH - OVERRAPPING}px`,
      width: `${DRAG_WIDTH + OVERRAPPING}px`,
      height: `${height - DRAG_WIDTH * 2 - OVERRAPPING * 2}px`
    }"
  />
  </VueDraggableResizable>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import VueDraggableResizable from 'vue-draggable-resizable'
import { GRID } from '@/components/numbers'
@Component<Drag>({
  components: {
    VueDraggableResizable
  }
})
export default class Drag extends Vue {
  @Prop()
  public width!: number
  @Prop()
  public height!: number
  @Prop()
  public x!: number
  @Prop()
  public y!: number
  @Prop()
  private onDragging!: (x: number, y: number) => void
  @Prop()
  private onDragStop!: () => void

  private dragging = false
  private DRAG_WIDTH = 20
  private GRID = GRID
  private OVERRAPPING = 8

  private onMove(x: number, y: number) {
    if (!this.dragging) {
      this.dragging = true
    }
    this.onDragging(x, y)
  }

  private onStop() {
    this.dragging = false
    this.onDragStop()
  }
}
</script>

<style scoped lang="scss">
.draggable {
  z-index: 5 !important;
  opacity: 0;
  width: 0 !important;
  height: 0 !important;
  cursor: grab;
  &:hover,
  &.isDragging {
    opacity: 1;
  }
}
.drag {
  position: absolute;
  background-size: 7px 7px;
  background-image: url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 14 14' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h1v1H0zm1 0h1v1H1zM0 1h1v1H0zm1 12h1v1H1zm1-1h1v1H2zm1-1h1v1H3zm1-1h1v1H4zm1-1h1v1H5zm-3 4h1v1H2zm1-1h1v1H3zm1-1h1v1H4zm1-1h1v1H5zm1-2h1v1H6zm0 1h1v1H6zm1-2h1v1H7zm0 1h1v1H7zm1-2h1v1H8zm0 1h1v1H8zm1-2h1v1H9zm0 1h1v1H9zm1-2h1v1h-1zm0 1h1v1h-1zm1-2h1v1h-1zm0 1h1v1h-1zm1-2h1v1h-1zm0 1h1v1h-1zm1-2h1v1h-1zm0 1h1v1h-1z' fill='%23D8D8D8' fill-rule='evenodd'/%3E%3C/svg%3E");
  &.left {
    background-position: 2px 0;
  }
  &.right {
    background-position: -2px 0;
  }
}
</style>