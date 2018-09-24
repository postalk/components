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

export const randomStr = (i: number = 8) =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, i)
