import path from 'path'
import requireContext from 'require-context'
import { configure } from '@storybook/vue'

let req

if (process.env.STORY_ENV === 'test') {
  req = requireContext(path.join(__dirname, '../src'), true, /.story.ts$/)
} else {
  req = require.context('../src', true, /.story.ts$/)
}

function loadStories() {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
