<script setup>
import { ref } from 'vue'

const emits = defineEmits(['set-username'])

const username = ref('')
const setUsername = () => emits('set-username', username.value)
</script>

<template>
  <v-card-text>
    <v-text-field
      v-model="username"
      placeholder="Enter a username"
      @keydown.enter="setUsername()"
    ></v-text-field>
    <v-btn block @click="setUsername()">
      Connect
    </v-btn>
  </v-card-text>
</template>
