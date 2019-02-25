<template>
  <table class="table" :style="{
      width: `${len * 120}px` 
    }">
    <tbody>
      <tr class="row" v-for="(value, index) in getRow()" :key="index">
        <td
          class="cell"
          v-for="(cell, i) in getCell(value)"
          :key="i"
          v-html="convertLinkified(cell)"
        />
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import linkify from 'linkifyjs/string'

@Component
export default class Table extends Vue {
  @Prop()
  private txt!: string
  private len = 0

  private created() {
    const rows = this.txt
      .split(/\r?\n/)
      .map(s => s.trim())
      .filter(s => !!s)

    rows.forEach(row => {
      const cells = row.split(/[\s|　][\/|／][\s|　]/).map(cell => cell.trim())
      this.len = cells.length > this.len ? cells.length : this.len
    })
  }

  private getRow(): string[] {
    return this.txt
      .split(/\r?\n/)
      .map(s => s.trim())
      .filter(s => !!s)
  }

  private getCell(row: string): string[] {
    return row.split(/[\s|　][\/|／][\s|　]/).map(cell => cell.trim())
  }

  private convertLinkified(str: string): string {
    return linkify(str)
  }
}
</script>

<style scoped lang="scss">
.table {
  line-height: $TABLE_LINE_HEIGHT;
  margin: calc(-1 * #{$PADDING} - #{$BORDER_WIDTH});
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
  border-bottom: 1px solid $BORDER_COLOR;
  border-right: 1px solid $BORDER_COLOR;
}
.cell {
  width: $TABLE_WIDTH;
  font-size: $TEXT;
  font-weight: normal;
  vertical-align: middle;
  padding: $PADDING;
  border: 1px solid $BORDER_COLOR;
  text-align: center;
  word-wrap: break-word;
}
</style>