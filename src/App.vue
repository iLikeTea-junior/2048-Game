<script setup lang="ts">
import Header from './components/Header.vue';


</script>

<template>
  <Header #title>2048</Header>

  <main>
    <router-view/>
  </main>

</template>

<style scoped>

main {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 1fr;
  grid-column-gap: 25px;
  grid-row-gap: 0px;
}

@media screen and (max-width: 645px) {
  main {
    grid-template-columns: 1fr;
    grid-template-rows: 2fr;
  }
}

</style>