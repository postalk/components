import { storiesOf, StoryDecorator } from '@storybook/vue'
import Dialog from './index.vue'
import { action } from '@storybook/addon-actions'

storiesOf('Dialog', module).add('Default', () => ({
  components: { Dialog },
  methods: {
    action
  },
  template: `<Dialog :handleOK="action('ok')"">
    Continue to link your accounts between two services.
   </Dialog>`
}))
