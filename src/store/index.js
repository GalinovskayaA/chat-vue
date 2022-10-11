import { defineStore } from 'pinia'
import * as socketio from '../plugins/socketio'

export const useStore = defineStore('store', () => {
  const sendEvent = (event) => socketio.sendEvent(event)

  return {
    sendEvent
  }
})
