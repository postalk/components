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
    @click.native="editing = true"
  ></textarea-autosize>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import VueTextareaAutosize from 'vue-textarea-autosize'

Vue.use(VueTextareaAutosize)

@Component
export default class Input extends Vue {
  @Prop() private handleSubmit!: (text: string) => void
  @Prop() private handleCancel!: () => void
  private value: string = ''
  private editing: boolean = false
  private doneEdit(): void {
    if (!this.value) {
      this.handleCancel()
      this.editing = false
      return
    }
    this.handleSubmit(this.value)
    this.editing = false
  }
  private onEnter(e: KeyboardEvent): void {
    if (e.shiftKey) {
      return
    }
    e.preventDefault()
    this.doneEdit()
  }
}
</script>

<style scoped lang="scss">
.input {
  width: 100%;
  border: none;
  opacity: 0;
  &:focus {
    border: #3098db;
    opacity: 1;
  }
}
</style>