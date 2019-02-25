<template>
  <div
    :class="{
      cardRoot: true,
      isMoving: movingId && movingId !== id,
      isSelected: selected,
      isDisabled: disabled,
      isImage: isImage(value),
      isTable: isTable(value),
      isYoutube: isYoutube(value),
      isTwitter: isTwitter(value),
      isEditing: editing,
      isOutside: x < 0 || x > CANVAS_WIDTH || y < 0 || y >  CANVAS_HEIGHT
    }"
    :style="{
      left: `${x}px`,
      top: `${y}px`,
      height: `${height - DRAG_WIDTH * 2 + BORDER_WIDTH * 2}px`
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
        'min-height': !value ? UNIT * 3 : undefined,
        width: isImage(value) ? `${width - (DRAG_WIDTH * 2 + BORDER_WIDTH * 2)}px` : undefined,
        height: isImage(value) ? `${height - (DRAG_WIDTH * 2 + BORDER_WIDTH * 2)}px` : undefined
      }"
      @click="onClick"
    >
      <CardInner
        :type="getType({ value, html, url, color })"
        :value="value"
        :html="html"
        :handleImageMeasure="onImageMeasure"
        :handleHTMLMeasure="onHTMLMeasure"
        :handleURL="onURL"
      />
      <CardInput
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
    <div v-if="disabled" class="disabled-text">selected by someone</div>
  </div>
</template>

<script lang="ts">
import isImage from 'is-image-url'
import { Component, Prop, Vue } from 'vue-property-decorator'
import CardInput from '@/components/CardInput/index.vue'
import CardInner from '@/components/CardInner/index.vue'
import Drag from './drag.vue'
import isUrl from 'is-url'
import {
  YELLOW,
  YELLOW_DARK,
  BLUE,
  BLUE_DARK,
  RED,
  RED_DARK,
  SELECT,
  OFFWHITE
} from '../color'
import {
  DRAG_WIDTH,
  PADDING,
  UNIT,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  BORDER_WIDTH,
  CARD_WIDTH
} from '@/components/numbers'
import {
  isYoutube,
  isTwitter,
  isTable,
  isOrderedList,
  isHeadline,
  getHeadlineHeight
} from '@/components/utils'

@Component<Card>({
  components: {
    CardInput,
    CardInner,
    Drag
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
    },
    html(newVal, oldVal) {
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
  public disabled!: boolean
  @Prop()
  private id!: string
  @Prop({ default: '' })
  private value!: string
  @Prop()
  private color!: string
  @Prop()
  private initial!: { x: number; y: number }
  @Prop()
  private html!: string
  @Prop()
  private url!: string

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
  @Prop()
  private handleURL!: (url: string, id: string) => void

  private show: boolean = true
  private editing: boolean = false
  private x: number = this.initial.x
  private y: number = this.initial.y
  private width: number = 0
  private height: number = 0
  private selectColor: string = SELECT

  private DRAG_WIDTH = DRAG_WIDTH
  private UNIT = UNIT
  private CANVAS_WIDTH = CANVAS_WIDTH
  private CANVAS_HEIGHT = CANVAS_HEIGHT
  private BORDER_WIDTH = BORDER_WIDTH

  private isImage = isImage
  private isYoutube = isYoutube
  private isTwitter = isTwitter
  private isTable = isTable

  private mounted() {
    this.matchBoundRect()
    if (this.id === 'new') {
      this.editing = true
    }
  }

  private matchBoundRect(): void {
    const el = this.$refs.card as Element
    this.height = el.clientHeight + DRAG_WIDTH * 2 + BORDER_WIDTH * 2
    this.width = el.clientWidth + DRAG_WIDTH * 2 + BORDER_WIDTH * 2
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
    this.height =
      Math.round(height / 2) + DRAG_WIDTH * 2 + PADDING * 2 + BORDER_WIDTH * 2
    this.width =
      Math.round(width / 2) + DRAG_WIDTH * 2 + PADDING * 2 + BORDER_WIDTH * 2
  }

  private onHTMLMeasure(ratio: number, defaultHeight: number) {
    this.height =
      defaultHeight +
      (CARD_WIDTH - PADDING * 2 - BORDER_WIDTH * 2) * ratio +
      DRAG_WIDTH * 2 +
      PADDING * 2 +
      BORDER_WIDTH * 2
  }

  private onDragging(x: number, y: number): void {
    if (!this.movingId) {
      this.handleStart(this.id)
    }
    const diffX = this.x - x - DRAG_WIDTH
    const diffY = this.y - y - DRAG_WIDTH
    this.x = x + DRAG_WIDTH
    this.y = y + DRAG_WIDTH
    this.handleMove(diffX, diffY, this.id)
  }

  private onURL(url: string) {
    this.handleURL(url, this.id)
  }

  private getType({
    value,
    html,
    url,
    color
  }: {
    value: string
    html: string
    url: string
    color: string
  }): string {
    return html && url === value
      ? 'webpage'
      : this.isImage(value)
      ? 'image'
      : this.isYoutube(value)
      ? 'youtube'
      : this.isTwitter(value)
      ? 'twitter'
      : isUrl(value)
      ? 'url'
      : this.isTable(value)
      ? 'table'
      : isOrderedList(value)
      ? 'list'
      : isHeadline(value, color)
      ? 'headline'
      : ''
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
          : this.color === 'offwhite'
          ? OFFWHITE
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
  width: $CARD_WIDTH;
  height: 0;
  position: absolute;
  z-index: $Z_CARD_ROOT;
  &.isMoving {
    .draggable {
      opacity: 0;
    }
  }
  &.isImage,
  &.isYoutube {
    z-index: $Z_MEDIA_CARD_ROOT !important;
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
    z-index: $Z_EDITING_CARD_ROOT;
    .card-draggable {
      display: none;
    }
  }
  &.isTable {
    width: auto;
    min-width: $TABLE_WIDTH;
    .card {
      width: auto;
    }
  }
  &.isDisabled {
    z-index: 0 !important;
    opacity: $DISABLED_OPACITY;
    &:after {
      content: '';
      background-color: rgba(255, 255, 255, 0);
      z-index: $Z_DISABLED_COVER;
      position: absolute;
      top: -1 * $DRAG_WIDTH;
      left: -1 * $DRAG_WIDTH;
      width: calc(100% + #{$DRAG_WIDTH} * 2);
      height: calc(100% + #{$DRAG_WIDTH} * 2);
    }
  }
  &.isOutside {
    opacity: $DISABLED_OPACITY;
  }
}

.card {
  cursor: pointer;
  position: absolute;
  width: 100%;
  background-color: #fff;
  border: $BORDER_WIDTH solid $BORDER_COLOR;
  line-height: 0;
  text-align: left;
  padding: $PADDING;
  z-index: $Z_CARD;
  user-select: none;
}

.input {
  min-height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.disabled-text {
  user-select: none;
  position: absolute;
  top: -1.125rem;
  left: 0;
  font-size: $TEXT;
  font-weight: bold;
  font-style: italic;
  color: $TEXT_COLOR;
}
</style>

<style lang="scss">
.calc-headline-height {
  font-size: $HEADLINE_TEXT;
  position: absolute;
  visibility: hidden;
  height: auto;
  width: calc(#{$CARD_WIDTH} - #{$PADDING} * 2 - #{$BORDER_WIDTH} * 2);
  word-break: break-word;
  line-height: $HEADLINE_LINE_HEIGHT;
  font-weight: 400;
}
</style>