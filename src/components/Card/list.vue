<template>
  <ul class="list">
    <li class="item" v-for="(value, index) in getList()" :key="index">
      {{ value }}
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component
export default class List extends Vue {
  @Prop() private txt!: string

  private getList(): string[] {
    return this.txt
      .split(/\r?\n/)
      .map(s => s.trim())
      .filter(s => !!s)
  }
}
</script>

<style scoped lang="scss">
.list {
  list-style-type: none;
  line-height: 1.5;
  padding-left: 0;
  margin: -0.5rem;
  font-size: 0.875rem;
}
.item {
  padding: 0.5rem;
  & + .item {
    border-top: 1px solid rgba(0, 0, 0, 0.05);
  }
}
</style>