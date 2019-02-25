<template>
  <h2 class="headline">{{ txt }}</h2>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component
export default class Headline extends Vue {
  @Prop()
  private txt!: string
}
</script>

<style scoped lang="scss">
.headline {
  text-align: center;
  font-size: $HEADLINE_TEXT;
  font-weight: 400;
  line-height: $HEADLINE_LINE_HEIGHT;
  margin-top: 0.1875rem;
  margin-bottom: 0.125rem;
  word-wrap: break-word;
}
</style>