import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'
import Input from './index.vue'
import { CenteredDecorator } from '@/components/test'

storiesOf('Input', module)
  .addDecorator(CenteredDecorator)
  .add('Default', () => ({
    components: { Input },
    template:
      '<div style="width: 300px"><Input :handleSubmit="submit" :handleCancel="cancel" /></div>',
    methods: { submit: action('Submit!'), cancel: action('Cancel!') }
  }))
