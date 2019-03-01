import Vue from 'vue'
import io from 'socket.io-client'

const HOST = location.origin
export const socket = io(HOST)

Vue.prototype.$socket = socket
