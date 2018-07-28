import { StoryDecorator } from '@storybook/vue'
import Centered from './Centered/index.vue'

export const CenteredDecorator = (story: StoryDecorator) => ({
  components: { Centered },
  template: `
    <Centered>
      <story></story>
    </Centered>
  `
})
