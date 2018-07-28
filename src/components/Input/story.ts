import { storiesOf, addDecorator } from '@storybook/vue'
import { action } from '@storybook/addon-actions'
import Input from './index.vue'
import { CenteredDecorator } from '@/components/test'

addDecorator(CenteredDecorator)

storiesOf('Input', module).add('Default', () => ({
  components: { Input },
  template: '<Input :handleClick="action" :rounded="true">Please X</Input>',
  methods: { action: action('Clicked!') }
}))
