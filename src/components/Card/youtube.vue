<template>
  <iframe v-if="getURL()" :src="getURL()" type="text/html" width="500" height="282" frameborder="0" allowfullscreen></iframe>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component
export default class Youtube extends Vue {
  @Prop()
  private txt!: string
  private getURL(): string {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/
    const match = this.txt.match(regExp)
    if (match) {
      return `https://www.youtube.com/embed/${match[2]}?enablejsapi=1`
    } else {
      return ''
    }
  }
}
</script>

<style scoped lang="scss">
</style>