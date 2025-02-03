<template>
  <header>
    
    <NuxtLink to="/"  id="title">
      <h1 >About page</h1>
    </NuxtLink>

    <nav>
      <Button 
        v-for="(btn, index) in buttons" 
        :key="index" 
        :buttonURL="btn.url" 
        :label="btn.label" 
      />  
    </nav>
  </header>
</template>

<script>
export default {
  props: {
    buttons: {
      type: Array,
      default: () => [
        { url: 'pagelink', label: 'label' },
        { url: 'pagelink', label: 'label' }
      ]
    }
  }
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