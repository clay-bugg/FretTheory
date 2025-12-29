<template>
    <div class="logos">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="100" height="100">
        <line x1="2" y1="16" x2="22" y2="16" stroke="currentColor" stroke-width="1" opacity="0.3"/>
        <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="1" opacity="0.3"/>
        <line x1="2" y1="8"  x2="22" y2="8"  stroke="currentColor" stroke-width="1" opacity="0.3"/>

        <circle cx="6" cy="16" r="2.5" />
        <circle cx="12" cy="12" r="2.5" />
        <circle cx="18" cy="8" r="2.5" />
        </svg>
    </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.logos {
    display: flex;
    justify-content: center;
    align-items: center;
    
    
    svg {
        display: block;
    }
}
</style>