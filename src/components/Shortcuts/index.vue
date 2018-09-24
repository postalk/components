<template></template>

<script lang="ts">
import debounce from 'debounce-promise'
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
  THREE,
  I,
  R,
  Y,
  B,
  W,
  ALT
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
  MOVE_MARKER,
  COLOR_MARKER
} from './actions'
import keyboardMap from './map'
import { addListener, removeListener } from '@/components/browser'

@Component
export default class Shortcuts extends Vue {
  @Prop() private selectedIds!: string[]

  @Prop() private onClearSelected!: () => void
  @Prop() private onRemoveSelected!: () => void
  @Prop()
  private onMoveSelected!: (diffX: number, diffY: number, key: string) => void
  @Prop() private onMoveDoneSelected!: () => void
  @Prop() private onChangeColor!: (color: string) => void
  @Prop() private onSelectAll!: () => void
  @Prop() private onCopy!: (e: ClipboardEvent) => void
  @Prop() private onPaste!: (e: ClipboardEvent) => void
  @Prop() private onUndo!: () => void
  @Prop() private onNewCard!: () => void
  @Prop() private onCreateMarker!: (left: number, top: number) => void
  @Prop() private onMoveMarker!: (left: number, top: number) => void
  @Prop() private onColorMarker!: () => void
  @Prop() private onClearMarker!: () => void

  private timer: () => Promise<void> = debounce(() => Promise.resolve(), 500)

  private created() {
    addListener('keydown', this.keyBoardHandler)
    addListener('copy', this.copyHandler as EventListener)
    addListener('paste', this.pasteHandler as EventListener)
  }

  private destroyed() {
    removeListener('keydown', this.keyBoardHandler)
    removeListener('copy', this.copyHandler as EventListener)
    removeListener('paste', this.pasteHandler as EventListener)
  }

  private mapActions(
    keyCode: number,
    withShift: boolean,
    withMeta: boolean,
    withCtrl: boolean,
    withAlt: boolean
  ) {
    const isSingle = !withShift && !withMeta && !withCtrl && !withAlt
    if (this.selectedIds.length > 0) {
      switch (true) {
        case keyCode === ALT && !withShift && !withMeta && !withCtrl:
          return {
            type: CHANGE_COLOR
          }
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
            direction: this.getDirection(keyCode, withShift),
            timer: this.timer
          }
        case keyCode === W && withAlt:
        case keyCode === R && withAlt:
        case keyCode === Y && withAlt:
        case keyCode === B && withAlt:
          return {
            type: CHANGE_COLOR,
            color:
              keyCode === W
                ? 'white'
                : keyCode === R
                  ? 'red'
                  : keyCode === Y ? 'yellow' : keyCode === B ? 'blue' : ''
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
      case keyCode === ALT:
        return {
          type: COLOR_MARKER
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
      case keyCode >= ZERO && keyCode <= NINE && isSingle:
        return {
          type: CREATE_MARKER,
          position: this.getPosition(keyCode, 'number')
        }
      case keyCode >= A && keyCode <= Z && isSingle:
        return {
          type: CREATE_MARKER,
          position: this.getPosition(keyCode, 'alpha')
        }
      case keyCode === COLON && isSingle:
      case keyCode === COMMA && isSingle:
      case keyCode === DOT && isSingle:
      case keyCode === SLASH && isSingle:
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

  private keyBoardHandler(e: KeyboardEvent) {
    const action = this.mapActions(
      e.which,
      e.shiftKey,
      e.metaKey,
      e.ctrlKey,
      e.altKey
    )
    switch (action.type) {
      case CLEAR_SELECTED:
        this.onClearSelected()
        return
      case REMOVE_SELECTED:
        this.onRemoveSelected()
        return
      case MOVE_SELECTED:
        e.preventDefault()
        if (action.timer) {
          action.timer().then(() => {
            this.onMoveDoneSelected()
          })
        }
        this.onMoveSelected(
          action.direction ? action.direction.left * -24 : 0,
          action.direction ? action.direction.top * -24 : 0,
          'none'
        )
        return
      case CHANGE_COLOR:
        this.onChangeColor(action.color ? action.color : '')
        return
      case SELECT_ALL:
        e.preventDefault()
        this.onSelectAll()
        return
      case UNDO:
        this.onUndo()
        return
      case NEW_CARD:
        this.onNewCard()
        return
      case COLOR_MARKER:
        this.onColorMarker()
        return
      case MOVE_MARKER:
        e.preventDefault()
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

  private copyHandler(e: ClipboardEvent) {
    e.preventDefault()
    this.onCopy(e)
  }

  private pasteHandler(e: ClipboardEvent) {
    e.preventDefault()
    this.onPaste(e)
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