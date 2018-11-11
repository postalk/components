<template></template>

<script lang="ts">
import debounce from 'debounce-promise'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { ENTER, ESCAPE, DELETE, BACKSPACE, Z, A, ARROW, ALT } from './keyboards'
import {
  NEW_CARD,
  CLEAR_SELECTED,
  UNKNOWN,
  REMOVE_SELECTED,
  MOVE_SELECTED,
  SELECT_ALL,
  UNDO,
  CHANGE_COLOR
} from './actions'
import keyboardMap from './map'
import { addListener, removeListener } from '@/components/browser'
import { GRID } from '@/components/numbers'

@Component
export default class Shortcuts extends Vue {
  @Prop()
  private selectedIds!: string[]

  @Prop()
  private onClearSelected!: () => void
  @Prop()
  private onRemoveSelected!: () => void
  @Prop()
  private onMoveSelected!: (diffX: number, diffY: number, key: string) => void
  @Prop()
  private onMoveDoneSelected!: () => void
  @Prop()
  private onChangeColor!: (color: string) => void
  @Prop()
  private onSelectAll!: () => void
  @Prop()
  private onCopy!: (e: ClipboardEvent) => void
  @Prop()
  private onPaste!: (e: ClipboardEvent) => void
  @Prop()
  private onUndo!: () => void
  @Prop()
  private onNewCard!: () => void

  private moveTimer = debounce(this.onMoveDoneSelected, 300)

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
            direction: this.getDirection(keyCode, withShift)
          }
      }
    }
    switch (true) {
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
        this.moveTimer()
        this.onMoveSelected(
          action.direction ? action.direction.left * -1 * GRID : 0,
          action.direction ? action.direction.top * -1 * GRID : 0,
          'none'
        )
        return
      case CHANGE_COLOR:
        this.onChangeColor('')
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
          : keyCode === ARROW.RIGHT
            ? scale
            : 0
    }
  }
}
</script>