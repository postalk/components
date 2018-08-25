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
        transform: moving && moving !== id
          ? `translate(${diffX}px, ${diffY}px)`
          : `translate(0px, 0px)`
      }"
    >
      <div 
        ref="card"
        class="card"
        :style="{
          transform: `translate(${x}px, ${y}px)`,
          'background-color': getColor()['background-color'],
          'border-color': getColor()['border-color']
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
        :x="x - 32"
        :y="y - 32"
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
import { yellow, yellowB, blue, blueB, red, redB } from '../color'

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
  @Prop() private color!: string
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
    this.height = el.clientHeight + 32 * 2 + 2
    this.width = el.clientWidth + 32 * 2 + 2
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
    const diffX = this.x - x - 32
    const diffY = this.y - y - 32
    this.x = x + 32
    this.y = y + 32
    this.handleMove(diffX, diffY, this.id)
  }

  private onDragstop(): void {
    this.grabbing = false
    this.handleStop()
  }

  private isHeadline(str: string): boolean {
    return str.match(/[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+/g)
      ? str.length < 9
      : str.length < 16
  }

  private isList(str: string): boolean {
    return (
      !!str.match(/\r?\n/) &&
      str.split(/\r?\n/).filter((s) => !!s.trim()).length > 1
    )
  }

  private getColor(): {
    'background-color': string
    'border-color': string
  } {
    return {
      'background-color':
        this.color === 'red'
          ? red
          : this.color === 'blue'
            ? blue
            : this.color === 'yellow' ? yellow : '',
      'border-color':
        this.color === 'red'
          ? redB
          : this.color === 'blue'
            ? blueB
            : this.color === 'yellow' ? yellowB : ''
    }
  }
}
</script>

<style scoped lang="scss">
.root {
  width: 12rem;
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
  border: 1px solid #efefef;
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
  word-wrap: break-word;
}

.input {
  min-height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.draggable {
  opacity: 0;
  background-size: 9px 9px;
  background-image: url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 18 18' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 0h1v1H1zm0 17h1v1H1zm1 0h1v1H2zm0-1h1v1H2zm1 0h1v1H3zm0-1h1v1H3zm1 0h1v1H4zm0-1h1v1H4zm1 0h1v1H5zm0-1h1v1H5zm1 0h1v1H6zm0-1h1v1H6zm1 0h1v1H7zm0-1h1v1H7zm1 0h1v1H8zm0-1h1v1H8zm1 0h1v1H9zm0-1h1v1H9zm1 0h1v1h-1zm0-1h1v1h-1zm1 0h1v1h-1zm0-1h1v1h-1zm1 0h1v1h-1zm0-1h1v1h-1zm1 0h1v1h-1zm0-1h1v1h-1zm1 0h1v1h-1zm0-1h1v1h-1zm1 0h1v1h-1zm0-1h1v1h-1zm1 0h1v1h-1zm0-1h1v1h-1zm1 0h1v1h-1zm0-1h1v1h-1zM0 0h1v1H0zm0 1h1v1H0z' fill='%23E6E6E6' fill-rule='evenodd'/%3E%3C/svg%3E");
  cursor: grab;
  &:hover {
    opacity: 1;
  }
}
</style>