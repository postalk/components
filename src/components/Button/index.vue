<template>
  <button class="button" :style="{color: color, borderColor: color}" @click="handleClick" :class="{rounded: rounded}"><slot></slot>!</button>
</template>

<script lang="ts">
// tslint:disable-next-line
const log = () => console.log('Welcome to storybook!');
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Button extends Vue {
  @Prop(Boolean) private rounded!: boolean;
  @Prop({ default: log }) private handleClick!: () => void;
  @Prop({ default: '#42b983' }) private color!: string;
}
</script>

<style>
  .rounded {
    border-radius: 5px;
  }
  .button {
    border: 3px solid;
    padding: 10px 20px;
    background-color: white;
    outline: none;
  }
  
</style>