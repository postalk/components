<template>
  <span v-linkified>{{ txt }}</span>
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