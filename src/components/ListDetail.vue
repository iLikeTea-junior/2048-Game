<script setup lang="ts">
const props = defineProps(['items'])
</script>

<template>
    <ul class="players" v-for="(player) in props.items">
        <li><slot name="list-item" v-bind="{name: player.name, score: player.score}"></slot></li>
    </ul>
</template>

<style scoped>
</style>