<template>

  <NuxtLink class="button" :to="buttonURL">
    {{ label }}
  </NuxtLink>

</template>

<script>

export default {
  props: {

    buttonURL: {
      type: String,
      default: '/',
      required: true
    },

    label: {
      type: String,
      default: 'button'
    }
  }
}

</script>

<style scoped>

  .button {
    width: 6em;
    height: 2em;
    font-family: inherit;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    appearance: none;
    border: 1px solid black;
    text-decoration: none;
    overflow: hidden;
    padding: 1em;
  }

  .button:hover {
    filter:brightness(110%);
    cursor: pointer;
    text-decoration: none;
  }

  .button:active {
    filter: brightness(95%);
    transform: scale(0.98)
  }

  .button:visited {
    text-decoration: none;
    color: black;
  }

</style>