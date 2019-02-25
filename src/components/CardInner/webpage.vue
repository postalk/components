<template>
  <span class="url" v-html="html"/>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import {
  UNIT,
  SMALL_TEXT,
  WEBSITE_MARGIN,
  LINE_HEIGHT
} from '@/components/numbers'

@Component
export default class WebPage extends Vue {
  @Prop()
  private html!: string
  @Prop()
  private handleMeasure!: (
    heigthPerWidth: number,
    defaultHeight: number
  ) => void

  private mounted() {
    const self = this
    const matches = this.html.match(/<img[^>]*src="([^"]*)"/g)
    if (!matches || matches.length < 2) {
      return
    }
    const imgEl = matches[1]
    const source = imgEl.match(/\s?src="(.+)"/)
    if (!source || source.length < 2) {
      return
    }
    const atag = this.html.match(/<a[^>]*>([\s\S]*?)<\/a>/)
    if (!atag) {
      return
    }
    const divtag = this.html.match(/<div[^>]*>([\s\S]*?)<\/div>/)
    if (!divtag) {
      return
    }

    let height = 0

    const calcSpan = document.createElement('div')
    calcSpan.className = 'calc-html-title-width'
    calcSpan.innerHTML = atag[1]
    document.body.appendChild(calcSpan)
    height = calcSpan.clientHeight
    document.body.removeChild(calcSpan)

    const calcDiv = document.createElement('div')
    calcDiv.className = 'calc-html-description-width'
    calcDiv.innerHTML = divtag[1]
    document.body.appendChild(calcDiv)
    height += calcDiv.clientHeight
    document.body.removeChild(calcDiv)

    const src = source[1]
    const img = new Image()
    img.onload = function() {
      const that = this as any
      self.handleMeasure(
        that.height / that.width,
        height + SMALL_TEXT * LINE_HEIGHT + WEBSITE_MARGIN * 3
      )
    }
    img.src = src
  }
}
</script>

<style lang="scss">
.url {
  line-height: $LINE_HEIGHT;
  position: relative;
  .url__favicon {
    top: 0;
    left: 0;
    position: absolute;
    width: 1rem;
    height: 1rem;
    display: block;
  }
  .url__sitetitle {
    padding-left: 1.25rem;
    color: $LIGHT_GRAY;
    font-size: $SMALL_TEXT;
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: $LINE_HEIGHT;
  }
  .url__title {
    display: block;
    font-size: $TEXT;
    margin-top: $WEBSITE_MARGIN;
    margin-bottom: $WEBSITE_MARGIN;
    line-height: $WEBSITE_LINE_HEIGHT;
    word-wrap: break-word;
  }
  .url__description {
    color: $GRAY;
    font-size: $SMALL_TEXT;
    margin-top: $WEBSITE_MARGIN;
    margin-bottom: $WEBSITE_MARGIN;
    line-height: $WEBSITE_LINE_HEIGHT;
    word-wrap: break-word;
  }
  .url__img {
    display: block;
    width: 100%;
  }
}

.calc-html-title-width {
  font-size: $TEXT;
  position: absolute;
  visibility: hidden;
  height: auto;
  width: calc(#{$CARD_WIDTH} - #{$PADDING} * 2 - #{$BORDER_WIDTH} * 2);
  word-break: break-word;
  line-height: $WEBSITE_LINE_HEIGHT;
}
.calc-html-description-width {
  font-size: $SMALL_TEXT;
  position: absolute;
  visibility: hidden;
  height: auto;
  width: calc(#{$CARD_WIDTH} - #{$PADDING} * 2 - #{$BORDER_WIDTH} * 2);
  word-break: break-word;
  line-height: $WEBSITE_LINE_HEIGHT;
}
</style>