<template>
  <span class="text" v-html="getLinkified()"/>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import linkify from 'linkifyjs/string'

@Component<URL>({
  watch: {
    txt(newVal, oldVal) {
      if (oldVal !== newVal) {
        this.handleURL(newVal)
      }
    }
  }
})
export default class URL extends Vue {
  @Prop()
  private txt!: string
  @Prop()
  private handleURL!: (url: string) => void
  private mounted() {
    this.handleURL(this.txt)
  }
  private getLinkified(): string {
    return linkify(this.txt)
  }
}
</script>

<style scoped lang="scss">
.text {
  font-size: 0.8125rem;
  color: #222;
  line-height: 1.5;
  word-wrap: break-word;
}
</style>