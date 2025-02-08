<template>
  <div id="page">
    <Header :buttons="[
  { url: '/login', label: 'login' },
  { url: '/signup', label: 'Sign Up' }
    ]"/>

    <main>
      <QuoteGenerator />
      <div id="page-options">
        <PageOption :cards="[
          { to: '/instruments', src: '/images/buttons/Instruments-button.png', alt: 'Instruments' },
          { to: '/tools', src: '/images/buttons/tools-button.png', alt: 'Tools' }
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

*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

h1 {
  font-size: 3.5rem;
}

#page {
  font-family: 'Kanit', sans-serif; 
  padding: 0;
  background-color: #487dac;
}

#page-options {
  margin: 1em auto;
  padding: 0 4em;
}

header {
  height: 5em;
  width: 100%;
  padding: 0 2em;
  border-bottom: 1px solid black;
}
</style>