import { storiesOf, addDecorator } from '@storybook/vue'
import Centered from './index.vue'

storiesOf('Centered', module).add('Default', () => ({
  components: { Centered },
  template: '<Centered>I’m centered</Centered>'
}))
