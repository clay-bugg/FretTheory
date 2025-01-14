<template>
  <div>
    <Header :buttonLabels="['Login', 'Sign Up']" />
    <main>
      <QuoteGenerator />
      <div id="page-options">
        <PageOption :cards="[
          { to: '/music_theory', src: '/images/button_images/music_theory.png', alt: 'Music Theory' },
          { to: '/interactive_tools', src: '/images/button_images/interactive_tools.png', alt: 'Tools' },
          { to: '/cheatsheets', src: '/images/button_images/cheatsheets.png', alt: 'CheatSheets' }
        ]" />
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style>
div {
  font-family: 'Kanit', sans-serif;
  margin: 0;
  padding: 0;
}

#page-options {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin: 1em auto;
  padding: 0 4em;
}
</style>