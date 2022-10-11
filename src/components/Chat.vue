<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from '@/store'
import { useChatStore } from '@/store/chat'
import { addEventListener } from '@/mixins/addEventListener'

import ChatLog from './ChatLog'
import ChatLogin from './ChatLogin'
import ChatSend from './ChatSend'
import ChatUsers from './ChatUsers'

const chatStore = useChatStore()
const store = useStore()

const userLocal = ref(chatStore.user)
const typingStatusLocal = ref({})

onMounted(() => {
  addEventListener.methods.addEventListener('userList', (users) => chatStore.setUsers(users))

  addEventListener.methods.addEventListener('userConnected', (user) => chatStore.addUser(user))

  addEventListener.methods.addEventListener('userLogin', (user) => {
    chatStore.setUser(user)
    userLocal.value = chatStore.getUser()
  })

  addEventListener.methods.addEventListener('chatHistory', (history) => chatStore.setHistory(history))

  addEventListener.methods.addEventListener('chatMessage', (message) => chatStore.addMessage(message))

  addEventListener.methods.addEventListener('typingStatus', (typingStatus) => typingStatusLocal.value = typingStatus)
})

const hasUser = computed(() => !!userLocal.value)
const chatUsers = computed(() => chatStore.getUsers())
const chatHistory = computed(() => chatStore.getHistory())

const setUsername = (username) => {
  store.sendEvent({
    type: 'userConnected',
    data: username
  })
}
const sendMessage = (message) => {
  store.sendEvent({
    type: 'chatMessage',
    data: {
      sender: userLocal.value,
      text: message
    }
  })
}
const setTypingStatus = () => {
  store.sendEvent({
    type: 'setTypingStatus',
    data: {
      user: userLocal.value
    }
  })
}
</script>

<template>
  <div class="chat">
    <div v-if="!hasUser">
      <v-card-title class="title"> Connect to chat </v-card-title>
      <ChatLogin @set-username="setUsername" />
    </div>
    <div v-else class="px-4">
      <v-card-title class="title"> Connected as {{ userLocal.uniqueName ?? 'no name' }} </v-card-title>
      <ChatLog
        :messages="chatHistory"
        :typing-status="typingStatusLocal"
        :username="userLocal.uniqueName"
      />
      <ChatSend @is-typing="setTypingStatus" @send="sendMessage" />
      <ChatUsers :users="chatUsers" :username="userLocal.uniqueName" />
    </div>
  </div>
</template>

<style scoped>
.chat {
  width: 40%;
}

.title {
  height: 82px;
}

@media (max-width: 1116px) {
  .chat {
    width: 100%;
  }
}
</style>
