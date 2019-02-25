<template>
  <span class="text" v-html="getLinkified()"/>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import linkify from 'linkifyjs/string'
import { nl2br } from '@/components/utils'

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
    return nl2br(linkify(this.txt))
  }
}
</script>

<style scoped lang="scss">
.text {
  font-size: $TEXT;
  color: $TEXT_COLOR;
  line-height: $LINE_HEIGHT;
  word-wrap: break-word;
}
</style>