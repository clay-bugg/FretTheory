<template>
  <header>
    <div id="title">
      <NuxtLink to="/" id="heading">
        <h1 :style="{ color: hcolor }">{{ heading }}</h1>
      </NuxtLink>
      <h2 id="subheading" :style="{ color: shcolor }">{{ subheading }}</h2>
    </div>

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

<script setup>
defineProps({
  heading: {
    type: String,
    required: false
  },
  subheading: {
    type: String,
    required: false
  },
  buttons: {
    type: Array,
    default: () => [
      { url: 'pagelink', label: 'label' },
      { url: 'pagelink', label: 'label' }
    ]
  },
  hcolor: { 
    type: String,
    default: '#fff'
  },
  shcolor: { 
    type: String,
    default: '#fff'
  }
});
</script>

<style scoped>
header {
  width: 100%;
  height: 4em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2em;
}

#title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: fit-content;
  gap: 1em;
  padding: 0;
  margin: 0;
  position: relative;
  top: 0.7em;
}



nav {
  display: flex;
  justify-content: space
}
</style>