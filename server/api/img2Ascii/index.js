const axios = require('axios')
module.exports = function (socket) {
  socket.on('get img', (url, callback) => {
    axios.get(url, { responseType: 'stream' }).then((res) => {
      const prefix = `data:${res.headers['content-type'] || 'image/png'};base64,`
      const data = res.data
      const chunks = []
      data.on('data', function (chunk) {
        chunks.push(chunk)
      })
      data.on('end', function () {
        const result = prefix + Buffer.concat(chunks).toString('base64')
        callback && callback(result)
      })
    })
  })
}
