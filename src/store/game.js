import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {
  const tiles = ref({})

  const getTiles = () => tiles.value

  const setTiles = (value) => tiles.value = value
  const addTile = (value) => app.set(tiles.value, value.id, value)

  const removeTile = (valueID) => app.delete(tiles.value, valueID)

  return {
    tiles,

    getTiles,
    setTiles,
    addTile,
    removeTile,
  }
})
