<template>
  <div class="tweet">
    <Tweet v-if="getId()" :id="getId()"></Tweet>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Tweet } from 'vue-tweet-embed'
@Component<Twitter>({
  components: {
    Tweet
  }
})
export default class Twitter extends Vue {
  @Prop()
  private txt!: string
  private getId(): string {
    const regExp = /^https\:\/\/twitter\.com\/.+\/status\/([0-9]+)/
    const match = this.txt.match(regExp)
    return match ? match[1] : ''
  }
}
</script>

<style scoped lang="scss">
.tweet {
  width: 18.375rem;
  height: 18rem;
  overflow: scroll;
}
</style>