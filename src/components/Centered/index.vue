<template>
  <div class="wrapper">
    <div class="centered">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Centered extends Vue {}
</script>

<style>
.wrapper {
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  text-align: center;
}
.centered {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>