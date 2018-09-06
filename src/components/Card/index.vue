<template>
    <div 
      v-if="show"
      :class="{
        cardRoot: true,
        isMoving: moving && moving !== id,
        isSelected: selected
      }"
      :style="{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width - 32 * 2 + 2}px`,
        height: `${height - 32 * 2 + 2}px`
      }"
      :id="id"
    >
      <div 
        ref="card"
        class="card"
        :style="{
          transform: moving && moving !== id && selected 
            ? `translate(${diffX}px, ${diffY}px)`
            : undefined,
          'background-color': getColor()['background-color'],
          'border-color': selected ? selectColor : getColor()['border-color'],
          'outline': selected ? `solid 1px ${selectColor}` : undefined,
          'min-height': !value ? '60px' : undefined
        }"
      >
        <List :txt="value" v-if="isList(value)" />
        <Headline :txt="value" v-else-if="isHeadline(value)" />
        <div class="text" v-else>{{ value }}</div>
        <Input 
          class="input" 
          :initial="value"
          :disabled="!!moving || disabled"
          :handleSubmit="submit"
          :isNew="id.match(/^new\-/)"
        />
      </div>
      <Drag
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
import { Component, Prop, Vue } from 'vue-property-decorator'
import Input from '@/components/Input/index.vue'
import Headline from './headline.vue'
import List from './list.vue'
import Drag from './drag.vue'
import {
  yellow,
  yellowB,
  blue,
  blueB,
  red,
  redB,
  select as selectColor
} from '../color'

@Component<Card>({
  components: {
    Headline,
    List,
    Input,
    Drag
  },
  watch: {
    moving(newVal, oldVal) {
      if (oldVal && !newVal) {
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
  @Prop() public diffX!: number
  @Prop() public diffY!: number
  @Prop() public moving!: string | undefined
  @Prop() public selected!: boolean
  @Prop() public disabled!: boolean
  @Prop() private id!: string
  @Prop({ default: '' })
  private value!: string
  @Prop() private initialX!: number
  @Prop() private initialY!: number
  @Prop() private color!: string

  @Prop() private handleMove!: (x: number, y: number, id: string) => void
  @Prop() private handleStop!: () => void
  @Prop() private handleStart!: (id: string) => void
  @Prop() private handleUpdate!: (id: string, value: string) => void
  @Prop() private handleRemove!: (id: string) => void

  private show: boolean = true
  private x: number = this.initialX
  private y: number = this.initialY
  private width: number = 0
  private height: number = 0
  private selectColor: string = selectColor

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

  private submit(value: string): void {
    if (!value) {
      this.handleRemove(this.id)
      return
    }
    this.handleUpdate(this.id, value)
  }

  private onDragging(x: number, y: number): void {
    if (!this.moving) {
      this.handleStart(this.id)
    }
    const diffX = this.x - x - 32
    const diffY = this.y - y - 32
    this.x = x + 32
    this.y = y + 32
    this.handleMove(diffX, diffY, this.id)
  }

  private isHeadline(str: string): boolean {
    return str.match(/[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+/g)
      ? str.length < 9
      : str.length < 16
  }

  private isList(str: string): boolean {
    return !!str.match(/\r?\n/)
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
.cardRoot {
  width: calc(12rem - 2px);
  height: 0;
  position: absolute;
  z-index: 0;
  &.isMoving {
    .draggable {
      opacity: 0;
    }
  }
}

.card {
  position: absolute;
  width: 100%;
  background-color: #fff;
  border: 1px solid #efefef;
  line-height: 0;
  text-align: left;
  padding: 0.5rem;
  z-index: 2;
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