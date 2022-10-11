<script setup>
import moment from "moment"

const props = defineProps(['message'])

const messageSettings =  {
  received: {
    align: 'align-self-start',
    color: '#b4d8fc'
  },
  sent: {
    align: 'align-self-end',
    color: '#c9fcfc'
  },
  server: {
    align: 'align-self-center',
    color: '#FFCC7A'
  }
}

const getSetting = (setting) => messageSettings[props.message.type][setting]

const formatTime = (time) => {
  if (moment(time).isSame(moment(), 'day')) {
    return moment(time).format('h:mm a')
  } else {
    return moment(time).format('D MMMM, h:mm a')
  }
}
</script>

<template>
  <v-alert
    class="my-1 message"
    text
    max-width="100%"
    :icon="false"
    :class="getSetting('align')"
    :color="getSetting('color')"
  >
    <div v-if="message.showSender" class="overline">
      <b> {{ message.sender.uniqueName }} </b>
    </div>
    <div class="black--text">
      {{ message.text }}
    </div>
    <div class="text-right time">
      {{ formatTime(message.time) }}
    </div>
  </v-alert>
</template>

<style scoped>
.message {
  height: max-content;
  overflow: visible;
}

.time {
  font-size: 10px;
  line-height: 10px;
}
</style>
