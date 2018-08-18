<template>
    <div 
      v-if="show"
      :class="{
        root: true,
        isGrabbing: grabbing,
        isMoving: moving && moving !== id,
        isFocusing: focusing
      }"
      :style="{
        'transform': moving && moving !== id ? `translate(${diffX}px, ${diffY}px)` : undefined
      }"
    >
      <div 
        ref="card"
        class="card"
        :style="{
          'transform': `translate(${x}px, ${y}px)`
        }"
      >
        <List :txt="value" v-if="isList(value)" />
        <Headline :txt="value" v-else-if="isHeadline(value)" />
        <div class="text" v-else>{{ value }}</div>
        <Input 
          class="input" 
          :handleSubmit="submit"
          :handleCancel="cancel"
          :handleFocus="focus"
          :initial="value"
          :disabled="moving"
        />
      </div>
      <VueDraggableResizable 
        ref="draggable"
        class="draggable"
        v-if="width > 0 && height > 0"
        :resizable="false"
        :grid="[24,24]"
        :w="width"
        :h="height"
        :x="x - 16"
        :y="y - 16"
        @dragging="onDragging"
        @dragstop="onDragstop"
      />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import VueDraggableResizable from 'vue-draggable-resizable'
import Input from '@/components/Input/index.vue'
import Headline from './headline.vue'
import List from './list.vue'

@Component<Card>({
  components: {
    Headline,
    List,
    Input,
    VueDraggableResizable
  },
  watch: {
    moving(newVal, oldVal) {
      if (oldVal && !newVal) {
        this.rerender()
      }
    }
  }
})
export default class Card extends Vue {
  @Prop() private id!: string
  @Prop({ default: '' })
  private value!: string
  @Prop() private initialX!: number
  @Prop() private initialY!: number
  @Prop() private diffX!: number
  @Prop() private diffY!: number
  @Prop() private moving!: boolean
  @Prop() private handleMove!: (x: number, y: number, id: string) => void
  @Prop() private handleStop!: () => void

  private show: boolean = true
  private x: number = this.initialX
  private y: number = this.initialY
  private width: number = 0
  private height: number = 0
  private grabbing: boolean = false
  private focusing: boolean = false

  private mounted() {
    this.matchBoundRect()
  }

  private matchBoundRect(): void {
    const el = this.$refs.card as Element
    this.height = el.clientHeight + 16 * 2 + 2
    this.width = el.clientWidth + 16 * 2 + 2
  }

  private rerender(): void {
    this.show = false
    this.x = this.initialX
    this.y = this.initialY
    this.$nextTick(() => {
      this.show = true
    })
  }

  private submit(): void {
    this.focusing = false
  }

  private cancel(): void {
    this.focusing = false
  }

  private focus(): void {
    this.focusing = true
  }

  private onDragging(x: number, y: number): void {
    if (!this.grabbing) {
      this.grabbing = true
    }
    const diffX = this.x - x - 16
    const diffY = this.y - y - 16
    this.x = x + 16
    this.y = y + 16
    this.handleMove(diffX, diffY, this.id)
  }

  private onDragstop(): void {
    this.grabbing = false
    this.handleStop()
  }

  private isHeadline(str: string): boolean {
    return str.match(/[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+/g)
      ? str.length < 8
      : str.length < 14
  }

  private isList(str: string): boolean {
    return (
      !!str.match(/\r?\n/) &&
      str.split(/\r?\n/).filter((s) => !!s.trim()).length > 1
    )
  }
}
</script>

<style scoped lang="scss">
.root {
  width: 13.5rem;
  height: 0;
  position: absolute;
  &.isGrabbing {
    .draggable {
      cursor: grabbing;
      opacity: 1;
    }
  }
  &.isFocusing {
    .card {
      overflow: visible;
    }
  }
}

.card {
  position: relative;
  background-color: #fff;
  border: 1px solid #e6e6e6;
  line-height: 0;
  text-align: left;
  padding: 0.5rem;
  z-index: 2;
  user-select: none;
  overflow: hidden;
}

.text {
  font-size: 0.875rem;
  color: #222;
  line-height: 1.5;
}

.input {
  min-height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.draggable {
  opacity: 0;
  background: #f6f6f6;
  cursor: grab;
  &:hover {
    opacity: 1;
  }
}
</style>