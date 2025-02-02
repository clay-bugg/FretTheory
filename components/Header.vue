<template>
  <header>
    
    <NuxtLink to="/about"  id="title">
      <h1 >About page</h1>
    </NuxtLink>

      <nav>
        <NuxtLink>
          <button class="button">Instruments</button>
        </NuxtLink>
        <NuxtLink>
          <button class="button">Tools</button>
        </NuxtLink>
    </nav>

  </header>
</template>

<script>
  export default {
  
  }
</script>

<style scoped>
header {
  width: 100%;
  border-bottom: rgba(0,0,0,0.5);
  box-shadow: 2px 2px 5px 2px black;
  height: 5em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2em;
  backdrop-filter: brightness(90%);
}

#title {
  font-size: 3em;
  text-decoration: none;
}

#title:visited {
  color: black;
}

  nav {
    display: flex;
    justify-content: space-bwtween;
    align-items: center;
    gap: 1em;
  }
  nav button {
    background: white;
    height: 50px;
    width: 120px;
    border-radius: 30px;
    font-family: inherit;
  }
  nav button:hover {
    cursor: pointer;
  }
</style>