<template>
  <transition name="modal">
    <div class="mask">
      <div class="wrapper">
        <div class="container">
          <p class="text">
            <slot/>
          </p>
          <div class="buttonWrapper">
            <button class="button" @click.self="handleOK">OK</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    handleOK: Function
  }
}
</script>

<style scoped lang="scss">
.mask {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.18s cubic-bezier(0.55, 0, 0.1, 1);
}

.wrapper {
  display: table-cell;
  vertical-align: middle;
}

.container {
  text-align: left;
  max-width: 18rem;
  margin: 3rem auto 9999rem;
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.18s cubic-bezier(0.55, 0, 0.1, 1);
}

.text {
  margin-top: 0;
}

.buttonWrapper {
  text-align: right;
}

.button {
  cursor: pointer;
  width: 6rem;
  height: 2.25rem;
  line-height: 2.25rem;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  border: 0;
  border-radius: 3px;
  background: #00e6e6;
  color: #fff;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  &:hover {
    background-color: #03cece;
  }
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>