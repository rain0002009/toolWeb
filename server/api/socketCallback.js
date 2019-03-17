const doSearch = require('./film/doSearch')
const img2Ascii = require('./img2Ascii')
const audio = require('./audio')
module.exports = function socketCall(socket) {
  doSearch(socket)
  img2Ascii(socket)
  audio(socket)
}
