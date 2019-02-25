<template>
  <textarea-autosize
    ref="input"
    class="input"
    placeholder="Type something here..."
    v-model="value"
    v-focus="editing"
    :min-height="30"
    :max-height="500"
    @blur.native="doneEdit"
    @keypress.native.enter.exact.prevent="onEnter"
    @keydown.native.esc="onEsc"
    @keydown.native="stopKeyEvent"
    @keypress.native="stopKeyEvent"
    @keyup.native="stopKeyEvent"
    @copy.native="stopEvent"
    @paste.native="stopEvent"
  ></textarea-autosize>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import VueTextareaAutosize from 'vue-textarea-autosize'
import { VNode, VNodeDirective, DirectiveFunction } from 'vue'
import { ENTER } from '@/components/Shortcuts/keyboards'

Vue.use(VueTextareaAutosize)

@Component({
  directives: {
    focus: {
      update: (
        el: HTMLElement,
        { value }: VNodeDirective,
        { context }: VNode
      ) => {
        if (!context) {
          return
        }
        if (!value) {
          context.$nextTick(() => {
            el.blur()
          })
          return
        }
      }
    }
  }
})
export default class CardInput extends Vue {
  @Prop()
  private handleSubmit!: (text: string) => void
  @Prop()
  private handleBlur!: () => void
  @Prop({ default: '' })
  private initial!: string
  @Prop({ default: false })
  private isNew!: boolean

  private value: string = this.initial
  private editing: boolean = true
  private isCancel: boolean = false

  private mounted() {
    const $el = (this.$refs.input as Vue).$el as HTMLElement
    $el.focus()
  }

  private doneEdit(): void {
    if (
      (this.isCancel && !this.isNew) ||
      (this.initial === this.value && this.value)
    ) {
      this.isCancel = false
      this.handleBlur()
      return
    }
    if (this.isCancel && this.isNew) {
      this.isCancel = false
      this.value = ''
    }
    this.value = this.value.trim()
    this.handleSubmit(this.value)
    this.handleBlur()
  }

  private onEnter(e: KeyboardEvent): void {
    if (!this.value) {
      return
    }
    this.editing = false
  }

  private onEsc(): void {
    this.isCancel = true
    this.editing = false
  }

  private stopKeyEvent(e: KeyboardEvent): void {
    if (!this.value && e.keyCode === ENTER && !e.shiftKey) {
      return
    }
    e.stopPropagation()
  }

  private stopEvent(e: ClipboardEvent): void {
    e.stopPropagation()
  }
}
</script>

<style scoped lang="scss">
.input {
  font-size: $TEXT;
  width: 100%;
  border: none;
  line-height: $LINE_HEIGHT;
  background-color: #fff;
  position: relative;
  padding: $PADDING;
  &:focus {
    border: $SELECT_COLOR;
  }
}
</style>