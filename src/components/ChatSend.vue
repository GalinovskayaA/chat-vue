<script setup>
import { ref } from 'vue'

const emits = defineEmits(['send', 'is-typing'])

const newMessage = ref('')

const sendMessage = () => {
  if (newMessage.value !== '') {
    emits('send', newMessage.value)
    newMessage.value = ''
  }
}
const textChanged = () => emits('is-typing')
</script>

<template>
  <v-card-text>
    <v-textarea
      v-model="newMessage"
      clearable
      placeholder="Send chat message"
      rows="3"
      :autofocus="true"
      :no-resize="true"
      :solo="true"
      @keydown.enter="sendMessage()"
      @keydown.enter.prevent
      @keydown="textChanged()"
    ></v-textarea>
    <v-btn block color="primary" @click="sendMessage()">
      Send
    </v-btn>
  </v-card-text>
</template>
