import { storiesOf, StoryDecorator } from '@storybook/vue'
import CardInner from './index.vue'
import Vue, { ComponentOptions } from 'vue'
import { action } from '@storybook/addon-actions'
import { dummyHTML } from '../data'

const CardInnerTester: ComponentOptions<Vue> = {
  components: { CardInner },
  data: () => {
    return {
      html: dummyHTML
    }
  },
  methods: {
    image: action('image'),
    _html: action('html'),
    url: action('url!')
  }
}

function TableCardDecorator(story: StoryDecorator) {
  return {
    template: `
    <div :style="{
      position: 'absolute',
      width: 'auto',
      'min-width': '11.25rem',
      height: 0
    }">
      <div :style="{
        position: 'absolute',
        cursor: 'pointer',
        width: 'auto',
        'background-color': '#fff',
        border: '1px solid #efefef',
        'line-height': 0,
        'text-align': 'left',
        padding: '0.5rem',
        'user-select': 'none'
      }">
       <story />
      </div>
    </div>
  `
  }
}

function TwitterCardDecorator(story: StoryDecorator) {
  return {
    template: `
    <div :style="{
      position: 'absolute',
      width: '10rem',
      height: 0
    }">
      <div :style="{
        position: 'absolute',
        cursor: 'pointer',
        width: 'auto',
        'background-color': '#fff',
        border: '1px solid #efefef',
        'line-height': 0,
        'text-align': 'left',
        padding: '0 0.5rem',
        'user-select': 'none'
      }">
       <story />
      </div>
    </div>
  `
  }
}

function ImageCardDecorator(story: StoryDecorator) {
  return {
    template: `
    <div :style="{
      position: 'absolute',
      width: '10rem',
      height: 0
    }">
      <div :style="{
        position: 'absolute',
        cursor: 'pointer',
        width: 'auto',
        'background-color': 'transparent',
        border: 'none',
        'line-height': 0,
        'text-align': 'left',
        padding: '0',
        'user-select': 'none'
      }">
       <story />
      </div>
    </div>
  `
  }
}

function CardDecorator(story: StoryDecorator) {
  return {
    template: `
    <div :style="{
      position: 'absolute',
      width: '10rem',
      height: 0
    }">
      <div :style="{
        position: 'absolute',
        cursor: 'pointer',
        width: '100%',
        'background-color': '#fff',
        border: '1px solid #efefef',
        'line-height': 0,
        'text-align': 'left',
        padding: '0.5rem',
        'user-select': 'none'
      }">
       <story />
      </div>
    </div>
  `
  }
}

storiesOf('CardInner', module)
  .addDecorator(CardDecorator)
  .add('webpage', () => ({
    methods: {},
    template: `<CardInner
      type="webpage"
      value="https://postalk.io"
      :html="html"
      :handleImageMeasure="image"
      :handleHTMLMeasure="_html"
      :handleURL="url"
    />`,
    ...CardInnerTester
  }))
  .add('url', () => ({
    methods: {},
    template: `<CardInner
      type="url"
      value="https://postalk.io"
      :html="''"
      :handleImageMeasure="image"
      :handleHTMLMeasure="_html"
      :handleURL="url"
    />`,
    ...CardInnerTester
  }))
  .add('ordered-list', () => ({
    methods: {},
    template: `<CardInner
      type="list"
      value="1 ああああ\n2 いいいい"
      :html="''"
      :handleImageMeasure="image"
      :handleHTMLMeasure="_html"
      :handleURL="url"
    />`,
    ...CardInnerTester
  }))
  .add('headline', () => ({
    methods: {},
    template: `<CardInner
      type="headline"
      value="ほげほげ"
      :html="''"
      :handleImageMeasure="image"
      :handleHTMLMeasure="_html"
      :handleURL="url"
    />`,
    ...CardInnerTester
  }))
  .add('text', () => ({
    methods: {},
    template: `<CardInner
      :type="''"
      value="ほげほげ"
      :html="''"
      :handleImageMeasure="image"
      :handleHTMLMeasure="_html"
      :handleURL="url"
    />`,
    ...CardInnerTester
  }))

storiesOf('CardInner', module)
  .addDecorator(ImageCardDecorator)
  .add('image', () => ({
    methods: {},
    template: `<CardInner
      type="image"
      value="https://i.gyazo.com/4215f0df9b4c256b39afd12327f40277.png"
      :html="''"
      :handleImageMeasure="image"
      :handleHTMLMeasure="_html"
      :handleURL="url"
    />`,
    ...CardInnerTester
  }))
  .add('youtube', () => ({
    methods: {},
    template: `<CardInner
      type="youtube"
      value="https://www.youtube.com/watch?v=sa-TUpSx1JA"
      :html="''"
      :handleImageMeasure="image"
      :handleHTMLMeasure="_html"
      :handleURL="url"
    />`,
    ...CardInnerTester
  }))

storiesOf('CardInner', module)
  .addDecorator(TwitterCardDecorator)
  .add('twitter', () => ({
    methods: {},
    template: `<CardInner
      type="twitter"
      value="https://twitter.com/koni_black/status/1099605282353606657"
      :html="''"
      :handleImageMeasure="image"
      :handleHTMLMeasure="_html"
      :handleURL="url"
    />`,
    ...CardInnerTester
  }))

storiesOf('CardInner', module)
  .addDecorator(TableCardDecorator)
  .add('table', () => ({
    methods: {},
    template: `<CardInner
      type="table"
      value="google.com / アイコス / レイガン\n理解者 / 鉄球の上に / 瓶ビール"
      :html="''"
      :handleImageMeasure="image"
      :handleHTMLMeasure="_html"
      :handleURL="url"
    />`,
    ...CardInnerTester
  }))
