<script setup>
const props = defineProps(['user'])

const chipSettings = {
  currentUser: {
    chipColour: 'primary',
    icon: 'person',
    iconColour: 'white'
  },
  otherUser: {
    chipColour: 'default',
    icon: 'person',
    iconColour: 'error'
  }
}
</script>

<template>
  <v-chip
    class="mr-2 mb-2 chip"
    :color="chipSettings[user.type].chipColour"
  >
    {{ user.uniqueName }}
  </v-chip>
</template>

<style scoped>
.chip {
  min-width: 32px;
}
</style>
