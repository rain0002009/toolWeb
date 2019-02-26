const puppeteer = require('puppeteer-core')
const _ = require('lodash')
const pkg = require('../../../package.json')
const { rules, addFilm, editFilm, ruleList } = require('./Rules')

function handleBack(liNode, socket, percent) {
  percent.done++
  socket.emit('get films', liNode, ~~(percent.done / percent.total * 100))
  return false
}

const run = async (socket) => {
  const browserBack = await puppeteer.launch({
    headless: true,
    executablePath: pkg.executablePath
  })
  socket.emit('get rules', ruleList)
  socket.on('set film name', (filmName) => {
    const percent = { total: Object.keys(rules).length, done: 0 }
    _.map(rules, (go, url) => go(url, browserBack, filmName).then(liNode => handleBack(liNode, socket, percent)))
  })

  socket.on('add film', (data, callback) => {
    addFilm(data)
    callback && callback()
  })

  socket.on('edit film', (data, callback) => {
    editFilm(data)
    callback && callback()
  })

  socket.on('disconnect', async function () {
    await browserBack.close()
  })
}
module.exports = run
