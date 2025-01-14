<template>
  <button :style="{ width: width, height: height }">
    <slot>Button</slot>
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    width: {
      type: String,
      default: '6.2em',
    },
    height: {
      type: String,
      default: '2.5em'
    }
  }
}
</script>

<style scoped>
button {
  background-color: #ffffff;
  color: rgb(0, 0, 0);
  border: 1px solid black;
  border-radius: 20px;
  margin: 0 0.5em;
  font-family: inherit;
  line-height: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  text-wrap: wrap;
}

button:hover {
  background-color: var(--navy-blue);
  color: #ffffff;

}

button:active {
  transform: scale(0.98);
}
</style>