<template>
  <div class="wrapper">
    <Cards
      :cards="cards"
      :author="author"
      :handleCreate="handleCreate"
      :handleUpdate="handleUpdate"
      :handleRemove="handleRemove"
      :handleImage="handleImage"
      :handleDeleteImage="handleDeleteImage"
      :handleUndo="handleUndo"
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

  @Prop()
  private handleUpdate!: (cards: Array<Partial<CardInfo>>) => void
  @Prop()
  private handleRemove!: (ids: string[]) => void
  @Prop()
  private handleCreate!: (cards: CardForm[]) => void
  @Prop()
  private handleImage!: (cards: CardForm[]) => void
  @Prop()
  private handleDeleteImage!: (fileNames: string[]) => void
  @Prop()
  private handleUndo!: () => void
}
</script>

<style scoped lang="scss">
.wrapper {
  width: 100%;
  height: 100%;
}
</style>