<script setup lang="ts">

import ListDetail from '@/components/ListDetail.vue';
import Button from '@/components/Button.vue'
import { useGameStore } from '@/stores/2048Store';
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, watch } from 'vue'
import NameBox from '@/components/NameBox.vue';
import { disableKeyInputs, enableKeyInputs } from '@/components/composables';

const gameStore = useGameStore()
gameStore.initStorage()

const route = useRoute()
const router = useRouter()

const playerExists = ref(false)
watch(
// This watch is meant to be used to get from localStorage, when trying to go to a player's game.
    () => route.params.player,
    (newPlayer) => {
        if (gameStore.getPlayer(<string>newPlayer)) {
            playerExists.value = true
        } else {
            playerExists.value = false
            router.push({path: '/game'})
        }
    }, {immediate: true}
)

const playerName = ref()
const players = computed(() => {return gameStore.getPlayers.sort((a, b) => b.score - a.score)})
const initiatingNewGame = ref(false)

function closeNameBox() {
    if (playerName.value) playerName.value = undefined
    initiatingNewGame.value = false
    enableKeyInputs()
}

function confirmName(valid: true | false) {
    if (valid) {
        gameStore.addNewPlayer(playerName.value)
        initiatingNewGame.value = false
        enableKeyInputs()
        router.push({name: "CurrentGame", params: {player: playerName.value}})
    }
}

function newGameRequested() {
    playerName.value = undefined
    initiatingNewGame.value = true
    disableKeyInputs()
}

</script>

<template>
    <aside class="left-content">
        <div class="player-list">
            <ListDetail :items="players">
                <template #list-item="{name, score}">
                    <router-link :to="{name: 'CurrentGame', params: {player: name}}">{{ name }} <span style="color: blue; font-weight: bold;">{{ score }}</span></router-link>
                </template>
            </ListDetail>
        </div>

        <div class="button">
            <Button @click="newGameRequested">New Game!</Button>
        </div>
    </aside>

    <template v-if="initiatingNewGame">
        <NameBox v-model="playerName"
                @close-tab="closeNameBox"
                @confirm-name="confirmName"
        >What is your name?</NameBox>
    </template>

    <section class="game">
        <router-view v-if="playerExists" :key="$route.fullPath"/>
    </section>
</template>

<style scoped>

.left-content {
    padding: 25px;
    min-width: 185px;
}

.player-list {
    border: solid 2px lightblue;
    border-radius: 10px;
    background-color: rgb(237, 251, 255);

    box-shadow:
    inset 0 0 0 5px #006caa,
    inset 0 0 0 10px #9ee8ff;

    padding: 20px;
    height: 400px;
    width: auto;
    max-height: 450px;
    max-width: 350px;
}

.button {
    padding: 25px 0px 0px 0px;
}

.game {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

a {
    text-decoration: none;
}

a:hover {
    background-color: #9ee8ff;
}

@media screen and (max-width: 645px){
    .player-list {
        display: none;
    }
}

</style>
