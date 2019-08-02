const axios = require('axios')
module.exports = function (socket) {
  socket.on('get audio', (url, callback, handleError) => {
    axios.get(url, { responseType: 'arraybuffer' })
      .then(({ data }) => {
        callback && callback(data)
      })
      .catch((e) => {
        handleError && handleError(e.message)
      })
  })
}
