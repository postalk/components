<template>
  <img class="image" :src="url">
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component
export default class Img extends Vue {
  @Prop()
  private url!: string
  @Prop()
  private handleMeasure!: (w: number, height: number) => void

  private mounted() {
    const self = this
    const img = new Image()

    img.onload = function() {
      const that = this as any
      self.handleMeasure(that.width, that.height)
    }

    img.src = this.url
  }
}
</script>

<style scoped lang="scss">
.image {
  display: block;
  width: 100%;
}
</style>