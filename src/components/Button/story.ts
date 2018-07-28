import { storiesOf, addDecorator } from '@storybook/vue'
import { action } from '@storybook/addon-actions'
import { CenteredDecorator } from '@/components/test'
import Button from './index.vue'

addDecorator(CenteredDecorator)

storiesOf('Button', module).add('Default', () => ({
  components: { Button },
  template: '<Button :handleClick="action" color="#444">Please X</Button>',
  methods: { action: action('Clicked!') }
}))
