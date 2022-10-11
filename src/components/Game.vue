<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { addEventListener } from '@/mixins/addEventListener'
import { useStore } from '@/store'
import { useGameStore } from "@/store/game"

const store = useStore()
const gameStore = useGameStore()

const isCompleted = ref(false)
const deleteTileID = ref(undefined)
const difficultyLevels = ref({})
const gameDifficulty = ref(undefined)
const selectedDifficulty = ref(undefined)
const gameLoaded = ref(false)

const getTiles = computed(() => gameStore.getTiles())
const activeTiles = computed(() => getTiles.value ? getTiles.value : {})
const tileStyle = computed(() => {
  const width = `width: ${gameDifficulty.value.tileSize}px;`
  const height = `height: ${gameDifficulty.value.tileSize}px;`

  return `${width} ${height}`
})
const percentCompleted = computed(() => {
  if (!gameLoaded.value) return 0

  const numTiles = gameDifficulty.value.gridSize * gameDifficulty.value.gridSize

  const numActive = Object.keys(activeTiles.value).length

  return Math.floor((numActive / numTiles) * 100)
})
const difficultyLevelOptions = computed(() => Object.values(difficultyLevels.value)
    .map(difficulty => difficulty.name))

onMounted(() => {
  addEventListener.methods.addEventListener('activeTiles', (value) => gameStore.setTiles(value))

  addEventListener.methods.addEventListener('setDifficultyLevels', (value) => difficultyLevels.value = value)

  addEventListener.methods.addEventListener('gameDifficulty', (value) => {
    gameDifficulty.value = value
    selectedDifficulty.value = value.name
  })

  addEventListener.methods.addEventListener('activateTile', (tile) => gameStore.ACTIVATE_TILE(tile))

  addEventListener.methods.addEventListener('deactivateTile', (tileID) => {
    deleteTileID.value = tileID

    setTimeout(() => {
      deleteTileID.value = undefined
    },125)

    gameStore.removeTile(tileID)
  })

  addEventListener.methods.addEventListener('gameCompleted', () => isCompleted.value = true)

  addEventListener.methods.addEventListener('resetGame', () => {
    gameStore.setTiles({})
    isCompleted.value = false
  })
})

const activateTile = (x, y) => {
  store.sendEvent({
    type: 'activateTile',
    data: {
      x: x,
      y: y
    }
  })
}
const isActive = (x, y) => activeTiles.value.hasOwnProperty(`${x},${y}`)
const isDeleting = (x, y) => deleteTileID.value === `${x},${y}`
const getTileClass = (x, y) => {
  let tileClass = 'tile'

  if (isCompleted.value) {
    tileClass += ' green'
  } else if (isDeleting(x, y)) {
    tileClass += ' red'
  } else if (isActive(x, y)) {
    tileClass += ' blue'
  }

  return tileClass
}
const resetGame = (difficulty) => {
  gameDifficulty.value = difficulty
  store.sendEvent({
    type: 'resetGame',
    data: gameDifficulty.value
  })
}

watch(percentCompleted, (newValue) => {
  if (gameLoaded.value) {
    if (newValue === 100) {
      store.sendEvent({
        type: 'allTilesActive',
        data:
          gameDifficulty.value.gridSize *
          gameDifficulty.value.gridSize
      })
    }
  }
})
watch(gameDifficulty, (newValue) => gameLoaded.value = (newValue !== undefined))
</script>

<template>
  <div>
    <v-card-title>
      Move the mouse to fill in the whole game board
    </v-card-title>
    <v-card-text>
      It's not impossible, but friends make it a lot easier!
    </v-card-text>
    <v-card-text v-if="gameLoaded" class="game">
      <div class="d-flex pa-0 grey lighten-2 board">
        <div v-for="x in gameDifficulty.gridSize" :key="x">
          <div v-for="y in gameDifficulty.gridSize" :key="y">
            <div
              :class="getTileClass(x, y)"
              :style="tileStyle"
              @mouseenter="activateTile(x, y)"
            ></div>
          </div>
        </div>
        <div
          v-if="isCompleted"
          class="text-h3 white--text text-center overlay"
        >
          Congratulations!
        </div>
      </div>

    </v-card-text>
    <v-card-title v-if="isCompleted">
      <v-col cols="3" class="px-0">
        <v-select
          v-model="selectedDifficulty"
          :items="difficultyLevelOptions"
        ></v-select>
      </v-col>
      <v-col cols="3" class="pa-0">
        <v-btn @click="resetGame(selectedDifficulty)"> Reset </v-btn>
      </v-col>
    </v-card-title>
    <v-card-title v-else>
      <div v-if="gameLoaded"> {{ percentCompleted }}% completed </div>
    </v-card-title>
  </div>
</template>

<style scoped>
.game {
  position: relative;
  padding: 0 16px;
}

.board {
  position: relative;
  background: whitesmoke;
  box-shadow: 5px 5px 15px 1px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.overlay {
  position: absolute;
  top: calc(50% - 24px);
  width: 100%;
}

.green {
  background: #A8E4A0
}
.red {
  background: #FF8F7A
}
.blue {
  background: #7ABAFF
}
</style>
