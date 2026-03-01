<script setup lang="ts">

import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { newGameFactory, nextGame } from '../../2048';
import { useRegisterMove, inputsEnabled, enableKeyInputs, useOrientation, usePointer, useDeviceInfo } from './composables';
import { useGameStore } from '@/stores/2048Store';
import { useRoute, useRouter } from 'vue-router'
import Button from '@/components/Button.vue'

const gameStore = useGameStore()
const props = defineProps(['player'])
const route = useRoute()
const game = ref<any>(null)
const board = ref<HTMLElement | null>(null)

const playingOnPhone = ref(false)
const orientationEnabled = ref(false)
const startA = ref(null); const startB = ref(null);const startG = ref(null)

watch(
    () => route.params.player,
    (newPlayer) => {
        game.value = gameStore.getGame(<string>newPlayer) || newGameFactory()
        gameStore.saveGame(<string>newPlayer, game.value)
    }, {immediate: true}
)

const tiles = computed(() => {return game.value.tiles.flat()})
const won = computed(() => {return game.value.won})
const play = computed(() => {return game.value.play})
const score = computed(() => {return game.value.score})

boardToString(tiles.value)

function getTileClass(value: number) {
    if (value > 2048) {
        return 'tile-super'
    }
    return `tile-${value}`
}

function keyPressed(event: any) {
    if (!inputsEnabled.value) return ;

    const movement= ref()
    if (event.key) {
        movement.value = useRegisterMove(event.key);
    } else if (event.type === 'touchstart' || event.type === 'touchend'){
        movement.value = usePointer(event)
    } else if (event.type === 'deviceorientation') {
        if (startA.value === null) startA.value = event.alpha, startB.value = event.beta, startG.value = event.gamma;
        movement.value = useOrientation(startA.value, startB.value, startG.value, event)
    }

    if (movement.value) {
        game.value = nextGame(game.value, movement.value);
        gameStore.saveGame(props.player, game.value)
    }
}

function toggleOrientation() {
    orientationEnabled.value = true

    ;(DeviceOrientationEvent as any).requestPermission() // had to change this because TypeScript does not know that requestPermission() exists.
    .then((response: string) => {
        if (response === 'granted') {
            // the event listener will run every time the phone moves or rotates.
            window.addEventListener('deviceorientation', keyPressed)
        }
    })

}

function disableOrientation() {
    orientationEnabled.value = false
    startA.value = startB.value = startG.value = null
    window.removeEventListener('deviceorientation', keyPressed)
}

function boardToString(gameTiles: number[]) {
    let boardString = ''

    const topBorder = " --- " + "--- ".repeat(3)
    const bottomBorder = topBorder

    const boardHeight = Math.sqrt(gameTiles.length)
    const boardWidth = boardHeight

    let currentRow = 0
    for (let y = 0; y<boardHeight; y++) {
        boardString += topBorder + "\n"; boardString += "|"
        for (let x=0; x<boardWidth; x++) {
            boardString += ` ${gameTiles[x + currentRow]} |`;
            if (x === boardWidth - 1) {
                boardString += '\n'
                currentRow += boardWidth;
            }
        }
    }
    boardString += bottomBorder
    return boardString
}

async function shareGame() {
    const shareData = {
        title: `${props.player}'s 2048 game`,
        text: `${boardToString(tiles.value)} \n Score --> ${score.value}`
    }

    try {
        if (!navigator.share) {
            alert("Sharing is not supported on this device.");
            return;
        }

        await navigator.share(shareData);
    } catch(err) {
        console.log("There has been a error", err)
    }
}

onMounted(() => {
    enableKeyInputs()
    playingOnPhone.value = useDeviceInfo()

    if (board.value) {
        board.value.addEventListener("touchstart", keyPressed)
        board.value.addEventListener("touchend", keyPressed)
    }

    window.addEventListener('keyup', keyPressed)
})

onUnmounted(() => {
    playingOnPhone.value = false
    
    if (board.value) {
        window.removeEventListener('touchstart', keyPressed)
        window.removeEventListener('touchend', keyPressed)
    }
    
    window.removeEventListener('keyup', keyPressed)
    gameStore.saveGame(props.player, game.value)
})

</script>

<template>
    <Button @click="shareGame" style="margin: 0px 0px 15px 0px;" class="orange">Share Score!</Button>

    <section ref="board" :class="play ? 'active' : 'done'">
        <div v-for="(tile, idx) in tiles" :key="idx" :class="getTileClass(tile)">
            <template v-if="tile">{{ tile }}</template>
        </div>
    </section>
    <h2>Score: {{ score }}</h2>

    <template v-if="playingOnPhone">
        <Button v-if="!orientationEnabled" @click="toggleOrientation" class="green">Enable Orientation</Button>
        <Button v-if="orientationEnabled" @click="disableOrientation" class="red">Disable Orientation</Button>
    </template>

    <p v-if="!play" style="font-weight: bold;">This game has no more moves left!</p>

    <template v-if="won">
        <p>Congrats! You won. You can continue playing if you want...</p>
    </template>
</template>

<style scoped>
section {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 0.3rem;
    background: #bbada0;
    width: 100%;
    max-width: 18rem;
    padding: 0.3rem;
    border-radius: 5px;
    /* disable user agent touch behavior */
    touch-action: none;
    font-size: 2rem;
}

div {
    display: flex;
    aspect-ratio: 1;
    width: 100%;
    align-items: center;
    justify-content: center;
    border: 1px solid grey;
    border-radius: 5px;
    background: rgba(238, 228, 218, 0.35);
    box-sizing: border-box;
}

.done {
    filter: brightness(70%)
}

.tile-2 {
    background: #eee4da;
    color: #776e65;
    font-size: 100%;
}

.tile-4 {
    background: #ede0c8;
    color: #776e65;
    font-size: 100%;
}

.tile-8 {
    background: #f2b179;
    color: #f9f6f2;
    font-size: 100%;
}

.tile-16 {
    background: #f59563;
    color: #f9f6f2;
    font-size: 100%;
}

.tile-32 {
    background: #f67c5f;
    color: #f9f6f2;
    font-size: 100%;
}

.tile-64 {
    background: #f65e3b;
    color: #f9f6f2;
    font-size: 100%;
}

.tile-128 {
    background: #edcf72;
    color: #f9f6f2;
    font-size: 80%;
    letter-spacing: -1px;
}

.tile-256 {
    background: #edcc61;
    color: #f9f6f2;
    font-size: 80%;
    letter-spacing: -1px;
}

.tile-512 {
    background: #edc850;
    color: #f9f6f2;
    font-size: 80%;
    letter-spacing: -1px;
}

.tile-1024 {
    background: #edc53f;
    color: #f9f6f2;
    font-size: 70%;
    letter-spacing: -2px;
}

.tile-2048 {
    background: #edc22e;
    color: #f9f6f2;
    font-size: 70%;
    letter-spacing: -2px;
    box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.55);
}

/* Super tiles (beyond 2048) */
.tile-super {
    background: #3c3a32;
    color: #f9f6f2;
    font-size: 65%;
    letter-spacing: -2px;
}
</style>