<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import ChatMessage from './ChatMessage'

const props = defineProps(['messages', 'username', 'typingStatus'])

const log = ref(null)
const scrollDistance = ref(0)
const logHeight = ref(400)
const hasScrolled = ref(true)
const showScrollButton = ref(false)

const hasTypingStatus = computed(() => formattedTypingStatus !== '')
const messagesToDisplay = computed(() => {
  let lastSender = ''
  let messages = []

  for (let message of props.messages) {
    message.type = getType(message)
    message.showSender =
        lastSender !== message.sender.uniqueName &&
        message.type === 'received'
    messages.push(message)

    lastSender = message.sender.uniqueName
  }

  return messages
})
const scrollHeight = computed(() => `max-height: ${logHeight.value}px;`)
const formattedTypingStatus = computed(() => {
  const users =
      Object.values(props.typingStatus).filter(status => {
        return status.user.uniqueName ===
            props.username && status.typing
      }).map(status => status.user.uniqueName)
  if (users.length === 0) {
    return '...'
  }

  const userString = users.join(', ').replace(/,([^,]*)$/, ' and $1')
  const userPlural = users.length > 1 ? 'are' : 'is'

  return `${userString} ${userPlural} typing...`
})

const getType = (message) => {
  return message.sender === 'Server' ?
    'server' :
    message.sender.uniqueName === props.username ?
      'sent' :
      'received'
}

const onScroll = (event) => {
  hasScrolled.value = true
  scrollDistance.value =
    event.target.scrollHeight -
    event.target.scrollTop -
    logHeight.value
}

const scrollToBottom = () => log.value.scrollTop = log.value.scrollHeight + 900

onMounted(() => {
  scrollToBottom()
  showScrollButton.value = false
})

watch(props.messages, () => {
  if (hasScrolled.value || props.messages.length > 9) showScrollButton.value = true
})
watch(scrollDistance, (value) => {
  if (value === 0) {
    hasScrolled.value = false
    showScrollButton.value = false
  } else {
    showScrollButton.value = true
  }
})
watch(messagesToDisplay, ((value, oldValue) => {
  if (value !== oldValue) scrollToBottom()
}))
</script>

<template>
  <v-card-text>
    <v-card>
      <div
        class="d-flex flex-column pa-4 overflow-y-auto log"
        ref="log"
        :style="scrollHeight"
        @scroll="onScroll"
      >
        <chat-message
          v-for="message of messagesToDisplay"
          :key="message.id"
          :message="message"
          class="gap"
        />
      </div>
      <v-fab-transition class="btn-wrapper">
        <v-btn
          v-if="showScrollButton"
          class="scroll"
          color="primary"
          fab
          x-small
          @click="scrollToBottom()"
        >
          down
        </v-btn>
      </v-fab-transition>
      <v-expand-transition v-if="hasTypingStatus">
        <div class="px-4 py-1 primary white--text caption">
          {{ formattedTypingStatus }}
        </div>
      </v-expand-transition>
    </v-card>
  </v-card-text>
</template>

<style scoped>
.log {
  position: relative;
  background: rgba(138, 55, 255, 0.2);
  scroll-behavior: smooth;
}

.log::-webkit-scrollbar {
  width: 12px;
}
.log::-webkit-scrollbar-track {
  background: rgba(138, 55, 255, 0.2);
}
.log::-webkit-scrollbar-thumb {
  background: rgba(138, 55, 255, 0.8);
  border-radius: 20px;
}

.btn-wrapper {
  position: relative;
  width: 100%;
}

.scroll {
  position: absolute;
  width: 20px;
  right: 32px;
  bottom: 35px;
}

.gap {
  margin-bottom: 20px;
}
</style>
