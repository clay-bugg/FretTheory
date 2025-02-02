<template>
  <header>
    
    <NuxtLink to="/"  id="title">
      <h1 >About page</h1>
    </NuxtLink>

      <nav>
        <NuxtLink to="/instruments">
          <button class="button">Instruments</button>
        </NuxtLink>
        <NuxtLink to="/tools">
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
  height: 5em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2em;
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


  
</style>