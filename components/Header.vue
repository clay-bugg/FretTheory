<template>
  <header>
    <h1>Music Theory</h1>
    <div id="login"
         v-if="showButtons">
      <Button v-for="(button, index) in buttonsArray"
              :key="index">
        {{ button.text }}
      </Button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  props: {
    buttonLabels: {
      type: Array,
      required: true
    },
    showButtons: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    buttonsArray() {
      return this.buttonLabels.map((label, index) => {
        return {
          id: index + 1,
          text: label
        }
      })
    }
  }
}

</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #8cb5d6;
  border-bottom: 1px solid black;
  height: 4rem;
  width: 100%;
  padding: 0 1em;
  background-image: url('public/images/background_images/notation.webp');
  background-size: cover;
  background-position: center;
  position: relative;
}

header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
}

header h1,
header div {
  padding: 0 1em;
  z-index: 1;
}

header h1 {
  color: var(--deep-navy-blue);
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
  z-index: 2;
  display: block;
}


header div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: fit-content
}

#signup-button:hover {
  background-color: var(--sunflower-yellow);
}
</style>