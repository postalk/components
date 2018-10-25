<template>
    <div 
      :class="{
        cardRoot: true,
        isMoving: movingId && movingId !== id,
        isSelected: selected,
        isImage: isImage(value),
        isTable: isTable(value),
        isYoutube: isYoutube(value),
        isTwitter: isTwitter(value),
        isEditing: editing
      }"
      :style="{
        left: `${x}px`,
        top: `${y}px`,
        height: `${height - DRAG_WIDTH * 2 + 2}px`
      }"
      :id="id"
      @dblclick="stopEvent"
    >
      <div 
        ref="card"
        class="card"
        :style="{
          transform: movingId && movingId !== id && selected 
            ? `translate(${diff.x}px, ${diff.y}px)`
            : undefined,
          'background-color': getColor()['background-color'],
          'border-color': selected ? selectColor : getColor()['border-color'],
          'outline': selected ? `solid 1px ${selectColor}` : undefined,
          'min-height': !value ? '60px' : undefined,
          width: isImage(value) ? `${width - (DRAG_WIDTH * 2 + 2)}px` : undefined,
          height: isImage(value) ? `${height - (DRAG_WIDTH * 2 + 2)}px` : undefined
        }"
        @click="onClick"
      >
        <Youtube :txt="value" v-if="isYoutube(value)" />
        <Twitter :txt="value" v-else-if="isTwitter(value)" />
        <Table :txt="value" v-else-if="isTable(value)" />
        <OrderedList :txt="value" v-else-if="isOrderedList(value)" />
        <List :txt="value" v-else-if="isList(value)" />
        <Img :url="value" :handleMeasure="onImageMeasure" v-else-if="isImage(value)" />
        <Headline :txt="value" v-else-if="isHeadline(value, color)" />
        <div class="text" v-else>{{ value }}</div>
        <Input 
          v-if="editing"
          class="input" 
          :initial="value"
          :isNew="id.match(/^new$/)"
          :handleSubmit="submit"
          :handleBlur="blur"
        />
      </div>
      <Drag
        v-if="show"
        class="card-draggable"
        :width="width"
        :height="height"
        :x="x"
        :y="y"
        :onDragging="onDragging"
        :onDragStop="handleStop"
      />
    </div>
</template>

<script lang="ts">
import isImage from 'is-image-url'
import { Component, Prop, Vue } from 'vue-property-decorator'
import Input from '@/components/Input/index.vue'
import Headline from './headline.vue'
import Table from './table.vue'
import OrderedList from './ordered-list.vue'
import List from './list.vue'
import Drag from './drag.vue'
import Img from './image.vue'
import Youtube from './youtube.vue'
import Twitter from './twitter.vue'
import {
  YELLOW,
  YELLOW_DARK,
  BLUE,
  BLUE_DARK,
  RED,
  RED_DARK,
  SELECT
} from '../color'

@Component<Card>({
  components: {
    Headline,
    Table,
    OrderedList,
    List,
    Img,
    Input,
    Drag,
    Youtube,
    Twitter
  },
  watch: {
    initial(newVal, oldVal) {
      if (oldVal.x !== newVal.x || oldVal.y !== newVal.y) {
        this.rerender()
      }
    },
    value(newVal, oldVal) {
      if (oldVal !== newVal) {
        this.$nextTick(() => {
          this.matchBoundRect()
          this.rerender()
        })
      }
    }
  }
})
export default class Card extends Vue {
  @Prop()
  public diff!: { x: number; y: number }
  @Prop()
  public movingId!: string | undefined
  @Prop()
  public selected!: boolean
  @Prop()
  private id!: string
  @Prop({ default: '' })
  private value!: string
  @Prop()
  private color!: string
  @Prop()
  private initial!: { x: number; y: number }

  @Prop()
  private handleMove!: (x: number, y: number, id: string) => void
  @Prop()
  private handleStop!: () => void
  @Prop()
  private handleStart!: (id: string) => void
  @Prop()
  private handleUpdate!: (id: string, value: string) => void
  @Prop()
  private handleRemove!: (id: string) => void
  @Prop()
  private handleSelect!: (id: string) => void

  private show: boolean = true
  private editing: boolean = false
  private x: number = this.initial.x
  private y: number = this.initial.y
  private width: number = 0
  private height: number = 0
  private selectColor: string = SELECT

  private DRAG_WIDTH = 20

  private mounted() {
    this.matchBoundRect()
    if (this.id === 'new') {
      this.editing = true
    }
  }

  private matchBoundRect(): void {
    const el = this.$refs.card as Element
    this.height = el.clientHeight + this.DRAG_WIDTH * 2 + 2
    this.width = el.clientWidth + this.DRAG_WIDTH * 2 + 2
  }

  private rerender(): void {
    this.show = false
    this.x = this.initial.x
    this.y = this.initial.y
    this.$nextTick(() => {
      this.show = true
    })
  }

  private stopEvent(e: MouseEvent): void {
    e.stopPropagation()
  }

  private submit(value: string): void {
    if (!value) {
      this.handleRemove(this.id)
      return
    }
    this.handleUpdate(this.id, value)
  }

  private onClick() {
    this.editing = true
    this.handleSelect(this.id)
  }

  private blur() {
    this.editing = false
  }

  private onImageMeasure(width: number, height: number) {
    this.height = Math.round(height / 2) + this.DRAG_WIDTH * 2 + 8 * 2 + 2
    this.width = Math.round(width / 2) + this.DRAG_WIDTH * 2 + 8 * 2 + 2
  }

  private onDragging(x: number, y: number): void {
    if (!this.movingId) {
      this.handleStart(this.id)
    }
    const diffX = this.x - x - this.DRAG_WIDTH
    const diffY = this.y - y - this.DRAG_WIDTH
    this.x = x + this.DRAG_WIDTH
    this.y = y + this.DRAG_WIDTH
    this.handleMove(diffX, diffY, this.id)
  }

  private isHeadline(str: string, color: string): boolean {
    const multiByteLen = Array.from(str).filter(s =>
      s.match(/[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+/g)
    ).length
    const textWidth = (str.length - multiByteLen) * 1 + multiByteLen * 2

    return multiByteLen
      ? textWidth < 24 && (color !== 'white' && !!color)
      : (str.split(/\b\S+\b/g).length - 1 < 3 || str.length < 14) &&
          (color !== 'white' && !!color)
  }

  private isList(str: string): boolean {
    return !!str.match(/\r?\n/)
  }

  private isOrderedList(str: string): boolean {
    return this.isList(str) && !!str.match(/^[0-9０-９](\.?)(\s|　)/)
  }

  private isTable(str: string): boolean {
    return !!str.match(/[\s|　][\/|／][\s|　]/)
  }

  private isImage(str: string): boolean {
    return isImage(str)
  }

  private isYoutube(str: string): boolean {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/
    const match = str.match(regExp)
    return !!match && match[2].length === 11
  }

  private isTwitter(str: string): boolean {
    const regExp = /^https\:\/\/twitter\.com\/.+\/status\/([0-9]+)/
    return !!str.match(regExp)
  }

  private getColor(): {
    'background-color': string
    'border-color': string
  } {
    return {
      'background-color':
        this.color === 'red'
          ? RED
          : this.color === 'blue'
            ? BLUE
            : this.color === 'yellow'
              ? YELLOW
              : '',
      'border-color':
        this.color === 'red'
          ? RED_DARK
          : this.color === 'blue'
            ? BLUE_DARK
            : this.color === 'yellow'
              ? YELLOW_DARK
              : ''
    }
  }
}
</script>

<style scoped lang="scss">
.cardRoot {
  width: 15rem;
  height: 0;
  position: absolute;
  z-index: 1;
  &.isMoving {
    .draggable {
      opacity: 0;
    }
  }
  &.isImage,
  &.isYoutube {
    z-index: 0 !important;
    .card {
      width: auto;
      background-color: transparent;
      border: none;
      padding: 0;
    }
  }
  &.isTwitter {
    .card {
      width: auto;
      padding-top: 0;
      padding-bottom: 0;
    }
  }
  &.isEditing {
    z-index: 3;
    .card-draggable {
      display: none;
    }
  }
  &.isTable {
    width: auto;
    min-width: 15rem;
    .card {
      width: auto;
    }
  }
}

.card {
  cursor: pointer;
  position: absolute;
  width: 100%;
  background-color: #fff;
  border: 1px solid #efefef;
  line-height: 0;
  text-align: left;
  padding: 0.5rem;
  z-index: 4;
  user-select: none;
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
</style>