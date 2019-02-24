const puppeteer = require('puppeteer-core')
const _ = require('lodash')
const { rules, addFilm } = require('./Rules')

function handleBack(liNode, socket, percent) {
  percent.done++
  socket.emit('get film', liNode, ~~(percent.done / percent.total * 100))
  return false
}

const run = async (socket) => {
  const browserBack = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Users\\rain0002009\\AppData\\Local\\Google\\Chrome SxS\\Application\\chrome'
  })
  socket.on('set film name', (filmName) => {
    const percent = { total: Object.keys(rules).length, done: 0 }
    _.map(rules, (go, url) => go(url, browserBack, filmName).then(liNode => handleBack(liNode, socket, percent)))
  })

  socket.on('add film', (data, callback) => {
    addFilm(data)
    callback && callback()
  })

  socket.on('disconnect', async function () {
    await browserBack.close()
  })
}
module.exports = run
