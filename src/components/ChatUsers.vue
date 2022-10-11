<script setup>
import { computed } from "vue"

import ChatUserChip from './ChatUserChip'

const props = defineProps(['users', 'username'])

const usersToDisplay = computed(() => {
  let users = []

  for (let user of props.users) {
    user.type = props.username === user.uniqueName ?
      'currentUser' :
      'otherUser'
    users.push(user)
  }

  return users
})
</script>

<template>
  <div>
    <v-card-subtitle> Connected Users </v-card-subtitle>
    <v-card-text>
      <chat-user-chip
        v-for="(user, i) of usersToDisplay"
        :key="i"
        :user="user"
      />
    </v-card-text>
  </div>
</template>
