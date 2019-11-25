import Vue from 'vue'
import io from 'socket.io-client'

const HOST = location.origin
export const socket = io(HOST)

Vue.prototype.$socket = socket

declare module 'vue/types/vue' {
  interface Vue {
    $socket: {
      emit (type: string, _url, _cb?)
      on (type: string, cb)
    }
  }
}
