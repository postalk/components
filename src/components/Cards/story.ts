import { storiesOf } from '@storybook/vue'
import Cards from './index.vue'
import Vue, { ComponentOptions } from 'vue'
import { cards } from '../data'

const SelectTester: ComponentOptions<Vue> = {
  components: { Cards },
  data: () => {
    return {
      cards,
      diffX: 0,
      diffY: 0,
      moving: undefined
    }
  }
}

storiesOf('Cards', module).add('Default', () => ({
  methods: {},
  template: `<Cards :cards="cards" />`,
  ...SelectTester
}))
