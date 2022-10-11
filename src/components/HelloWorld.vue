<script setup>
import * as socketio from '@/plugins/socketio'

import Chat from './Chat'
import Game from './Game'
import { useChatStore } from '@/store/chat'
import { computed, onMounted, ref } from "vue"

const textInput = ref('')
const serverOutput = ref([])

const chatStore = useChatStore()
const users = computed(() => chatStore.users)

onMounted(() => {
  socketio.addEventListener({
    type: 'message',
    callback: (message) => {
      message.received = Date.now()
      serverOutput.value.push(message)
    }
  })
})
</script>

<template>
  <div class="hello-world">
    <Chat />
    <Game />
  </div>
</template>

<style scoped>
.hello-world {
  width: 100%;
  height: 100vh;

  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
</style>
