<template>
  <textarea-autosize
    class="input"
    placeholder="Type something here..."
    v-model="value"
    v-focus="editing"
    :min-height="30"
    :max-height="500"
    @blur.native="doneEdit"
    @keypress.native.enter="onEnter"
    @keydown.native.esc="onEsc"
    @focus.native="editing = true"
  ></textarea-autosize>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import VueTextareaAutosize from 'vue-textarea-autosize'
import { VNode, VNodeDirective, DirectiveFunction } from 'vue'

Vue.use(VueTextareaAutosize)

Vue.directive('focus', {
  update: (el: HTMLElement, { value }: VNodeDirective, { context }: VNode) => {
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
})

@Component
export default class Input extends Vue {
  @Prop() private handleSubmit!: (text: string) => void
  @Prop() private handleCancel!: () => void
  @Prop({ default: '' })
  private initial!: string
  private value: string = this.initial
  private editing: boolean = false
  private isCancel: boolean = false
  private doneEdit(): void {
    if (this.isCancel || !this.value) {
      this.handleCancel()
      this.isCancel = false
      return
    }
    this.handleSubmit(this.value)
  }
  private onEnter(e: KeyboardEvent): void {
    if (e.shiftKey) {
      return
    }
    e.preventDefault()
    this.editing = false
  }
  private onEsc(): void {
    this.isCancel = true
    this.editing = false
  }
}
</script>

<style scoped lang="scss">
.input {
  width: 100%;
  border: none;
  &:focus {
    border: #3098db;
  }
  &:not(:focus) {
    opacity: 0;
  }
}
</style>