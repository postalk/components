import { storiesOf, StoryDecorator } from '@storybook/vue'
import Shortcuts from './index.vue'
import { action } from '@storybook/addon-actions'

storiesOf('Shortcuts', module)
  .add('Default', () => ({
    components: { Shortcuts },
    methods: {
      action
    },
    template: `<Shortcuts
    :selectedIds="[]"
    :onClearSelected="action('clear')"
    :onRemoveSelected="action('remove')"
    :onMoveSelected="action('move')"
    :onChangeColor="action('color')"
    :onSelectAll="action('all')"
    :onUndo="action('undo')"
    :onNewCard="action('new')"
    :onCreateMarker="action('create')"
  />`
  }))
  .add('Selected', () => ({
    components: { Shortcuts },
    methods: {
      action
    },
    template: `<Shortcuts
    :selectedIds="['key1']"
    :onClearSelected="action('clear')"
    :onRemoveSelected="action('remove')"
    :onMoveSelected="action('move')"
    :onChangeColor="action('color')"
    :onSelectAll="action('all')"
    :onUndo="action('undo')"
    :onNewCard="action('new')"
    :onCreateMarker="action('create')"
  />`
  }))
