const axios = require('axios')
module.exports = function (socket) {
  socket.on('get audio', (url, callback) => {
    axios.get(url, { responseType: 'arraybuffer' }).then(({ data }) => {
      callback && callback(data)
    })
  })
}
