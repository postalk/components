import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import HelloWorld from './index.vue'

storiesOf('HelloWorld', module).add('to Storybook', () => ({
  components: { HelloWorld },
  template: '<HelloWorld :showApp="action" />',
  methods: { action: action('ShowApp') }
}))
