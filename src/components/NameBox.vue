<script setup lang="ts">
import { useGameStore } from '@/stores/2048Store';
import Button from './Button.vue';
import { ref } from 'vue'

const emit = defineEmits(['closeTab', 'confirmName'])
const playerName = defineModel<string>()
const gameStore = useGameStore()

const redMessage = ref<string | null>(null)

function validUsername(playerN: string | undefined) {
    if (!playerN) {
        redMessage.value = 'Name cannot be empty!'
        return false;
    } else if (playerN && /\s/.test(playerN)) {
        redMessage.value = 'Whitespaces are not allowed!';
        return false;
    } else if (playerN && playerN.length <= 3) {
        redMessage.value = 'The name has to be longer than 3 characters!'
        return false;
    } else if (playerN && playerN.length >= 10) {
        redMessage.value = "should be shorter than 10 characters!"
        return false;
    } else if (playerN && gameStore.getPlayer(playerN)) {
        redMessage.value = "That name is already in use!"
        return false;
    }

    redMessage.value = null
    return true;
}

</script>

<template>
    <div class="overlay">

        <div class="name-box">
            <button class="close-button" @click="$emit('closeTab')">x</button>

            <h2><slot></slot></h2>

            <input type="text" v-model="playerName"></input>

            <br>
            <template v-if="redMessage">
                <p style="color: red; font-weight: bold;">{{ redMessage }}</p>
            </template>
            <br>

            <Button @click="$emit('confirmName', validUsername(playerName))">Confirm</Button>

        </div>

    </div>
</template>

<style scoped>

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background:rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
}

input {
    border-radius: 15px;
    padding: 5px;
    font-size: 20px;
    width: 75%;
}

.name-box {
    border: 3px solid lightblue;
    border-radius: 10px;
    background-color: rgb(237, 251, 255);
    padding: 25px;
    box-shadow: 0 0 20px rgba(0, 108, 170, 0.4);
    z-index: 1000;
}

.close-button {
    width: 40px;
    border-radius: 5px;
    background: linear-gradient(to bottom, rgb(255, 160, 176), red);
    border: solid 1px darkred;
    color: white;
    box-shadow: inset  #e67a73;
    box-shadow: 2px 3px 7px 1px #0008;
}

.close-button:hover {
    cursor: pointer;
    background: none;
    background-color: rgb(255, 58, 58);
}

</style>