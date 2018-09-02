import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'
import Input from './index.vue'
import { CenteredDecorator } from '@/components/test'

storiesOf('Input', module)
  .addDecorator(CenteredDecorator)
  .add('Default', () => ({
    components: { Input },
    data: () => {
      return {
        value: 'Test'
      }
    },
    template: `<div style="width: 300px">
        <Input
          :initial="value"
          :disabled="false"
          :handleSubmit="submit"
        />
      </div>`,
    methods: {
      submit: action('Submit!')
    }
  }))
