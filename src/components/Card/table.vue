<template>
  <table
    class="table"
    :style="{
      width: `${len * 120}px` 
    }"
  >
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
  line-height: 1.3;
  margin: calc(-0.5rem - 1px);
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
}
.cell {
  width: 7.5rem;
  font-size: 0.8125rem;
  font-weight: normal;
  vertical-align: middle;
  padding: 0.6125rem 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  text-align: center;
}
</style>