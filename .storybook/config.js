import registerRequireContextHook from 'babel-plugin-require-context-hook/register'
registerRequireContextHook()
import { configure } from '@storybook/vue'

// automatically import all files ending in *.stories.js
const req = require.context('../src', true, /.story.ts$/)
function loadStories() {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
