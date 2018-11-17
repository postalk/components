<template>
  <span v-linkified class="text">{{ txt }}</span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import linkify from 'vue-linkify'

Vue.directive('linkified', linkify)

@Component
export default class URL extends Vue {
  @Prop()
  private txt!: string
  @Prop()
  private handleURL!: (url: string) => void
  private mounted() {
    this.handleURL(this.txt)
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