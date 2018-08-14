import initStoryshots from '@storybook/addon-storyshots'

initStoryshots({
  storyNameRegex: /^((?!.*?DontTest).)*$/,
  storyKindRegex: /^((?!.*?DontTest).)*$/,
  configPath: '.storybook/config.test.js'
})
