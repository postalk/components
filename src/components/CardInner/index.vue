<template>
  <div>
    <WebPage
      v-if="type === 'webpage'"
      :html="html"
      :handleMeasure="handleHTMLMeasure"
    />
    <ImageContent
      :url="value"
      :handleMeasure="handleImageMeasure"
      v-else-if="type === 'image'"
    />
    <Youtube :txt="value" v-else-if="type === 'youtube'"/>
    <Twitter :txt="value" v-else-if="type === 'twitter'"/>
    <URL :txt="value" :handleURL="handleURL" v-else-if="type === 'url'"/>
    <Table :txt="value" v-else-if="type === 'table'"/>
    <OrderedList :txt="value" v-else-if="type === 'list'"/>
    <Headline :txt="value" v-else-if="type === 'headline'"/>
    <div class="text" v-else v-html="getLinkified()"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Headline from './headline.vue'
import Table from './table.vue'
import OrderedList from './ordered-list.vue'
import ImageContent from './image.vue'
import Youtube from './youtube.vue'
import Twitter from './twitter.vue'
import URL from './url.vue'
import WebPage from './webpage.vue'
import linkify from 'linkifyjs/string'
import { nl2br } from '@/components/utils'

@Component<CardInner>({
  components: {
    Headline,
    Table,
    OrderedList,
    ImageContent,
    Youtube,
    Twitter,
    URL,
    WebPage
  }
})
export default class CardInner extends Vue {
  @Prop()
  private type!: string
  @Prop({ default: '' })
  private value!: string
  @Prop()
  private html!: string

  @Prop()
  private handleImageMeasure!: (width: number, height: number) => void
  @Prop()
  private handleHTMLMeasure!: (ratio: number, defaultHeight: number) => void
  @Prop()
  private handleURL!: (url: string) => void

  private getLinkified(): string {
    return nl2br(linkify(this.value))
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