import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'
import CardInput from './index.vue'
import { CenteredDecorator } from '@/components/test'

storiesOf('CardInput', module)
  .addDecorator(CenteredDecorator)
  .add('Default', () => ({
    components: { CardInput },
    data: () => {
      return {
        value: 'Test'
      }
    },
    template: `<div style="width: 300px">
        <CardInput
          :initial="value"
          :isNew="false"
          :handleSubmit="submit"
          :handleBlur="blur"
        />
      </div>`,
    methods: {
      submit: action('Submit!'),
      blur: action('blur!')
    }
  }))
