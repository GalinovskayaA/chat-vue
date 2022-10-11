import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', () => {
  const users = ref([])
  const user = ref(undefined)
  const history = ref([])

  const getUsers = () => users.value
  const getUser = () => user.value
  const getHistory = () => history.value

  const setUsers = (value) => users.value = value
  const setUser = (newUser) => user.value = newUser
  const addUser = (value) => app.set(users.value, value.userID, value)
  const setHistory = (value) => history.value = value
  const addMessage = (message) => app.set(history.value, message.id, message)

  return {
    users,
    user,
    history,

    getUsers,
    getUser,
    getHistory,
    setUsers,
    addUser,
    setUser,
    setHistory,
    addMessage,
  }
})
