<template>
  <div class="wrapper">
    <Cards
      :cards="cards"
      :disableIds="disableIds"
      :author="author"
      :handleCreate="handleCreate"
      :handleUpdate="handleUpdate"
      :handleRemove="handleRemove"
      :handleSelect="handleSelect"
      :handleImage="handleImage"
      :handleUndo="handleUndo"
      :handleURL="handleURL"
      :handleAddUndoActions="handleAddUndoActions"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Cards from '@/components/Cards/index.vue'
import { CardInfo, CardForm } from '@/components/types'

@Component<CardsWrapper>({
  components: {
    Cards
  }
})
export default class CardsWrapper extends Vue {
  @Prop({ default: [] })
  private cards!: CardInfo[]
  @Prop({ default: '' })
  private author!: string
  @Prop({ default: [] })
  private disableIds!: string[]

  @Prop()
  private handleCreate!: (cards: CardForm[]) => void
  @Prop()
  private handleUpdate!: (cards: Array<Partial<CardInfo>>) => void
  @Prop()
  private handleRemove!: (ids: string[]) => void
  @Prop()
  private handleSelect!: (ids: string[]) => void
  @Prop()
  private handleImage!: (cards: CardForm[]) => void
  @Prop()
  private handleURL!: (url: string, id: string) => void
  @Prop()
  private handleUndo!: () => void
  @Prop()
  private handleAddUndoActions!: (
    actions: {
      type: string
      ids?: string[]
      cards?: Array<Partial<CardInfo>>
    }
  ) => void
}
</script>

<style scoped lang="scss">
.wrapper {
  width: 100%;
  height: 100%;
}
</style>