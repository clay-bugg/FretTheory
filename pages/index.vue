<template>
  <div id="page">
    <main>
      <img src="/images/logo.png" id="logo"/>
      <Navbar id="nav"/>
    </main>
  </div>
</template>

<script setup>
</script>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

#page {
  font-family: 'Kanit', sans-serif;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
}

main {
  width: fit-content;
  height: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-shadow: -3px 3px 6px rgba(0,0,0,0.5);
  border-top: 1px solid rgba(0, 0, 0, 0.4);
  border-right: 1px solid rgba(0,0,0,0.4);
  padding: 2em;
  border-radius: 20px;
}

main img {
  width: auto;
  height: 170px;
}
</style>