import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'
import { CenteredDecorator } from '@/components/test'
import Button from './index.vue'

storiesOf('Button', module)
  .addDecorator(CenteredDecorator)
  .add('Default', () => ({
    components: { Button },
    template: '<Button :handleClick="action" color="#444">Please X</Button>',
    methods: { action: action('Clicked!') }
  }))
