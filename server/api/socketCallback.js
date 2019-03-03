const doSearch = require('./film/doSearch')
const img2Ascii = require('./img2Ascii')
module.exports = function socketCall(socket) {
  doSearch(socket)
  img2Ascii(socket)
}
