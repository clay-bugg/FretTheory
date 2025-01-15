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
  name: 'App'
}
</script>

<style>

h1 {
  font-size: 3.5rem;
}

div {
  font-family: 'Kanit', sans-serif;
  margin: 0;
  padding: 0;
}

#page-options {
  margin: 1em auto;
  padding: 0 4em;
}
</style>