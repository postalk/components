<template></template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import {
  ENTER,
  ESCAPE,
  DELETE,
  BACKSPACE,
  ZERO,
  NINE,
  Z,
  A,
  COLON,
  COMMA,
  DOT,
  SLASH,
  ARROW,
  ONE,
  TWO,
  THREE
} from './keyboards'
import {
  NEW_CARD,
  CLEAR_SELECTED,
  UNKNOWN,
  REMOVE_SELECTED,
  CREATE_MARKER,
  MOVE_SELECTED,
  SELECT_ALL,
  UNDO,
  CHANGE_COLOR,
  CLEAR_MARKER,
  MOVE_MARKER
} from './actions'
import keyboardMap from './map'

@Component
export default class Shortcuts extends Vue {
  @Prop() private selectedIds!: string[]

  @Prop() private onClearSelected!: () => void
  @Prop() private onRemoveSelected!: () => void
  @Prop() private onMoveSelected!: (left: number, top: number) => void
  @Prop() private onChangeColor!: (color: string) => void
  @Prop() private onSelectAll!: () => void
  @Prop() private onUndo!: () => void
  @Prop() private onNewCard!: () => void
  @Prop() private onCreateMarker!: (left: number, top: number) => void
  @Prop() private onMoveMarker!: (left: number, top: number) => void
  @Prop() private onClearMarker!: () => void

  private created() {
    window.addEventListener('keydown', this.handler)
  }

  private destroyed() {
    window.removeEventListener('keydown', this.handler)
  }

  private mapActions(keyCode: number, withShift: boolean, withMeta: boolean) {
    if (this.selectedIds.length > 0) {
      switch (true) {
        case keyCode === ESCAPE:
          return {
            type: CLEAR_SELECTED
          }
        case keyCode === DELETE:
        case keyCode === BACKSPACE:
          return {
            type: REMOVE_SELECTED
          }
        case keyCode === ARROW.UP:
        case keyCode === ARROW.DOWN:
        case keyCode === ARROW.LEFT:
        case keyCode === ARROW.RIGHT:
          return {
            type: MOVE_SELECTED,
            direction: this.getDirection(keyCode, withShift)
          }
        case keyCode === ONE:
        case keyCode === TWO:
        case keyCode === THREE:
        case keyCode === ZERO:
          return {
            type: CHANGE_COLOR,
            color: keyCode - ZERO
          }
      }
    }
    switch (true) {
      case keyCode === ESCAPE:
        return {
          type: CLEAR_MARKER
        }
      case keyCode === ARROW.UP:
      case keyCode === ARROW.DOWN:
      case keyCode === ARROW.LEFT:
      case keyCode === ARROW.RIGHT:
        return {
          type: MOVE_MARKER,
          direction: this.getDirection(keyCode, withShift)
        }
      case keyCode === A && withMeta:
        return {
          type: SELECT_ALL
        }
      case keyCode === Z && withMeta:
        return {
          type: UNDO
        }
      case keyCode === ENTER:
        return {
          type: NEW_CARD
        }
      case keyCode >= ZERO && keyCode <= NINE:
        return {
          type: CREATE_MARKER,
          position: this.getPosition(keyCode, 'number')
        }
      case keyCode >= A && keyCode <= Z:
        return {
          type: CREATE_MARKER,
          position: this.getPosition(keyCode, 'alpha')
        }
      case keyCode === COLON:
      case keyCode === COMMA:
      case keyCode === DOT:
      case keyCode === SLASH:
        return {
          type: CREATE_MARKER,
          position: this.getPosition(keyCode)
        }
      default:
        return {
          type: UNKNOWN
        }
    }
  }

  private handler(e: KeyboardEvent) {
    const action = this.mapActions(e.which, e.shiftKey, e.metaKey)
    switch (action.type) {
      case CLEAR_SELECTED:
        this.onClearSelected()
        return
      case REMOVE_SELECTED:
        this.onRemoveSelected()
        return
      case MOVE_SELECTED:
        this.onMoveSelected(
          action.direction ? action.direction.left * 24 : 0,
          action.direction ? action.direction.top * 24 : 0
        )
        return
      case CHANGE_COLOR:
        this.onChangeColor(
          action.color === 1
            ? 'blue'
            : action.color === 2
              ? 'yellow'
              : action.color === 3 ? 'red' : 'white'
        )
        return
      case SELECT_ALL:
        this.onSelectAll()
        return
      case UNDO:
        this.onUndo()
        return
      case NEW_CARD:
        this.onNewCard()
        return
      case MOVE_MARKER:
        this.onMoveMarker(
          action.direction ? action.direction.left * 24 : 0,
          action.direction ? action.direction.top * 24 : 0
        )
        return
      case CLEAR_MARKER:
        this.onClearMarker()
        return
      case CREATE_MARKER:
        this.onCreateMarker(
          action.position ? Number(action.position.slice(-1)) : 0,
          action.position ? Number(action.position.slice(0, 1)) : 0
        )
        return
    }
  }

  private getDirection(keyCode: number, withShift: boolean) {
    const scale = withShift ? 3 : 1
    return {
      top:
        keyCode === ARROW.UP ? -1 * scale : keyCode === ARROW.DOWN ? scale : 0,
      left:
        keyCode === ARROW.LEFT
          ? -1 * scale
          : keyCode === ARROW.RIGHT ? scale : 0
    }
  }

  private getPosition(keyCode: number, type?: string) {
    if (type === 'number') {
      return keyboardMap[keyCode - ZERO]
    } else if (type === 'alpha') {
      return keyboardMap[keyCode - A + 10]
    } else {
      return keyCode === COLON
        ? keyboardMap[36]
        : keyCode === COMMA
          ? keyboardMap[37]
          : keyCode === DOT
            ? keyboardMap[38]
            : keyCode === SLASH ? keyboardMap[39] : keyboardMap[0]
    }
  }
}
</script>