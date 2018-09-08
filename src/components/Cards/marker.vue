<template>
  <div
    v-if="x !== 0 && y !== 0"
    :class="`marker ${color}`"
    :style="{
      top: `${y}px`,
      left: `${x}px`
    }"
  >
    <div 
      :class="`icon text ${color}`"
      @click="handleText"
    />
    <Dropzone
      ref="myVueDropzone"
      id="dropzone"
      :class="`icon image ${color}`"
      :options="{
        url: `https://httpbin.org/post`
      }"
      @vdropzone-file-added="onAddFile"
      >
    </Dropzone>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Dropzone from 'vue2-dropzone'

@Component<Mark>({
  components: {
    Dropzone
  }
})
export default class Mark extends Vue {
  @Prop() private color!: string
  @Prop() private x!: number
  @Prop() private y!: number

  @Prop() private handleText!: () => void
  @Prop() private handleImage!: () => void

  private onAddFile() {
    // TODO  Upload to Firebase
    this.handleImage()
  }
}
</script>


<style lang="scss">
.dz-default {
  display: none;
}
</style>

<style scoped lang="scss">
.marker {
  background-color: rgba(255, 255, 255, 0.85);
  width: 12rem;
  height: 7rem;
  position: absolute;
  overflow: hidden;
  border: 4px solid rgba(#d8d8d8, 0.5);
  box-shadow: 0 0 0 0 rgba(#d8d8d8, 0.5);
  animation: pulse 0.6s infinite;
  &.blue {
    border-color: rgba(#8ee8e8, 0.5);
    box-shadow: 0 0 0 0 rgba(#8ee8e8, 0.5);
    animation: bluepulse 0.6s infinite;
  }
  &.yellow {
    border-color: rgba(#f9f116, 0.7);
    box-shadow: 0 0 0 0 rgba(#f9f116, 0.7);
    animation: yellowpulse 0.6s infinite;
  }
  &.red {
    border-color: rgba(#f39393, 0.5);
    box-shadow: 0 0 0 0 rgba(#f39393, 0.5);
    animation: redpulse 0.6s infinite;
  }
}

.icon {
  cursor: pointer;
  position: absolute;
  line-height: 0;
  border-right: 1px solid rgba(#9aa4aa, 0.3);
  width: calc(6rem - 3px);
  height: 100%;
  background-color: transparent;
  &:hover {
    background-color: rgba(#282e34, 0.05);
  }
  background-repeat: no-repeat;
  background-size: 34px 34px;
  &.text {
    background-position: 1.875rem 2rem;
    background-image: url("data:image/svg+xml,%3Csvg width='34' height='34' viewBox='0 0 34 34' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M0 0h34v34H0z'/%3E%3Cpath d='M33.25 1.588c.224.224.392.462.504.714.112.252.168.518.168.798s-.056.56-.168.84c-.112.28-.28.503-.504.671l-6.383 6.383h1.344v22.928H1V6.71h22.928v1.176l6.299-6.3c.224-.223.461-.377.713-.461.252-.084.518-.126.798-.126s.56.042.84.126c.28.084.504.238.672.462zm-6.467 30.906V11.162L15.445 22.5h-2.94v-3.107l11.17-11.254H2.429v24.355h24.355zm5.46-28.89a.376.376 0 0 0 .21-.252c.027-.112.041-.196.041-.252a.69.69 0 0 0-.042-.21.827.827 0 0 0-.21-.294.532.532 0 0 0-.252-.126 1.149 1.149 0 0 0-.252-.042.69.69 0 0 0-.21.042c-.084.028-.182.07-.294.126l-17.3 17.384v1.092h.923L32.242 3.604z' fill='%23000'/%3E%3C/g%3E%3C/svg%3E");
  }
  &.image {
    left: calc(6rem - 3px);
    background-position: 1.6875rem 2.125rem;
    background-image: url("data:image/svg+xml,%3Csvg width='34' height='34' viewBox='0 0 34 34' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M0 0h34v34H0z'/%3E%3Cpath d='M1 2h31.691v30.43H1V2zm1.262 19.148v2.375h28.722l-6.605-6.68-4.453 3.786-8.758-8.832-8.906 9.351zm29.168 10.02v-6.383H2.262v6.383H31.43zm0-8.98V3.262H2.262v16.031l8.906-9.277 8.906 8.832 4.453-3.785 6.903 7.124zm-6.977-10.02a3.12 3.12 0 0 1-1.262-.26 3.358 3.358 0 0 1-1.039-.705 3.108 3.108 0 0 1-.63-.965 3.113 3.113 0 0 1-.26-1.261c0-.446.086-.854.26-1.225.173-.371.383-.705.63-1.002a3.358 3.358 0 0 1 1.04-.705c.395-.173.816-.26 1.261-.26.445 0 .854.087 1.225.26.37.173.705.408 1.002.705.297.297.52.63.668 1.002.148.371.222.78.222 1.225 0 .445-.074.865-.222 1.261a2.26 2.26 0 0 1-.668.965 3.502 3.502 0 0 1-1.002.705 2.86 2.86 0 0 1-1.225.26zm0-5.121c-.297 0-.557.05-.78.148a2.105 2.105 0 0 0-.63.446 1.742 1.742 0 0 0-.371.593 1.985 1.985 0 0 0-.149.743c0 .296.05.556.149.779.099.223.223.408.371.556.198.198.408.347.63.446.223.099.483.148.78.148.248 0 .495-.05.742-.148a1.35 1.35 0 0 0 .594-.445 1.82 1.82 0 0 0 .371-.557c.1-.223.149-.483.149-.78 0-.247-.05-.494-.149-.742a1.742 1.742 0 0 0-.37-.593 1.35 1.35 0 0 0-.595-.446 1.985 1.985 0 0 0-.742-.148z' fill='%23000'/%3E%3C/g%3E%3C/svg%3E");
  }
  &.blue {
    background-color: rgba(#8ee8e8, 0.1);
    border-right-color: rgba(#8ee8e8, 0.3);
    &:hover {
      background-color: rgba(#8ee8e8, 0.25);
    }
  }
  &.red {
    background-color: rgba(#f39393, 0.1);
    border-right-color: rgba(#f39393, 0.2);
    &:hover {
      background-color: rgba(#f39393, 0.2);
    }
  }
  &.yellow {
    background-color: rgba(#f9f116, 0.1);
    border-right-color: rgba(#f9f116, 0.7);
    &:hover {
      background-color: rgba(#f9f116, 0.3);
    }
  }
}

@keyframes pulse {
  0% {
  }
  99% {
    box-shadow: 0 0 0 8px rgba(#d8d8d8, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(#d8d8d8, 0);
  }
}

@keyframes bluepulse {
  0% {
  }
  99% {
    box-shadow: 0 0 0 8px rgba(#8ee8e8, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(#8ee8e8, 0);
  }
}

@keyframes yellowpulse {
  0% {
  }
  99% {
    box-shadow: 0 0 0 8px rgba(#f9f116, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(#f9f116, 0);
  }
}

@keyframes redpulse {
  0% {
  }
  99% {
    box-shadow: 0 0 0 8px rgba(#f39393, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(#f39393, 0);
  }
}
</style>