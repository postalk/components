<template>
  <span class="url" v-html="html" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { UNIT } from '@/components/numbers'

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
    const match = imgEl.match(/[^"\'=\s]+\.(jpe?g|png|gif|svg)/)
    if (!match) {
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

    const src = match[0]
    const img = new Image()
    img.onload = function() {
      const that = this as any
      self.handleMeasure(
        that.height / that.width,
        height + 18 + 0.125 * 3 * UNIT
      )
    }
    img.src = src
  }
}
</script>

<style lang="scss">
.url {
  line-height: 1.5;
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
    color: #999;
    font-size: 0.75rem;
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 18px;
  }
  .url__title {
    display: block;
    font-size: 0.8125rem;
    margin-top: 0.125rem;
    margin-bottom: 0.125rem;
    line-height: 1.5;
  }
  .url__description {
    color: #666;
    font-size: 0.75rem;
    margin-top: 0.125rem;
    margin-bottom: 0.125rem;
    line-height: 1.5;
  }
  .url__img {
    display: block;
    width: 100%;
  }
}
.calc-html-title-width {
  font-size: 0.8125rem;
  position: absolute;
  visibility: hidden;
  height: auto;
  width: calc(12rem - 1rem - 2px);
  word-break: break-word;
  line-height: 1.5;
}
.calc-html-description-width {
  font-size: 0.75rem;
  position: absolute;
  visibility: hidden;
  height: auto;
  width: calc(12rem - 1rem - 2px);
  word-break: break-word;
  line-height: 1.5;
}
</style>