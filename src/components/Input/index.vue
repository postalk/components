<template>
  <!-- <button class="button" :style="{color: color, borderColor: color}" @click="handleClick" :class="{rounded: rounded}">
    <slot></slot>!
  </button> -->
  <textarea-autosize
    placeholder="Type something here..."
    ref="someName"
    v-model="someValue"
    :min-height="30"
    :max-height="350"
    @blur.native="onBlurTextarea"
  ></textarea-autosize>
</template>

<script lang="ts">
// tslint:disable-next-line
const log = () => console.log('Welcome to storybook!')
import { Component, Prop, Vue } from 'vue-property-decorator'
import VueTextareaAutosize from 'vue-textarea-autosize'

Vue.use(VueTextareaAutosize)

@Component
export default class Input extends Vue {
  @Prop(Boolean) private rounded!: boolean
  @Prop({ default: log })
  private handleClick!: () => void

  private someValue: string = ''
  private onBlurTextarea(e: KeyboardEvent): void {
    // tslint:disable-next-line
    console.log(e)
  }
}
</script>

<style>
.rounded {
  border-radius: 5px;
}
.button {
  border: 3px solid;
  padding: 10px 20px;
  background-color: white;
  outline: none;
}
</style>