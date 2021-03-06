const puppeteer = require('puppeteer-core')
const _ = require('lodash')
const pkg = require('../../../package.json')
const { rules, addFilm, editFilm, deleteFilm, ruleList, createCallback } = require('./Rules')

function handleBack (liNode, socket, percent) {
  percent.done++
  socket.emit('get films', liNode, ~~(percent.done / percent.total * 100))
  return false
}

const run = (socket) => {
  let browserBack = null
  socket.on('get rules', (callback) => {
    callback(ruleList)
  })
  socket.emit('get rules', ruleList)
  socket.on('set film name', async (filmName, browserURL) => {
    browserBack = await puppeteer.connect({
      browserURL: browserURL || pkg.browserURL
    })
    const percent = { total: Object.keys(rules).length, done: 0 }
    _.map(rules, (go, url) => go(url, browserBack, filmName).then(liNode => handleBack(liNode, socket, percent)))
  })

  socket.on('add film', (data, callback) => {
    addFilm(data)
    socket.emit('get rules', ruleList)
    callback && callback()
  })

  socket.on('remove file', (data, callback) => {
    deleteFilm(data)
    socket.emit('get rules', ruleList)
    callback && callback()
  })

  socket.on('edit film', (data, callback) => {
    editFilm(data)
    socket.emit('get rules', ruleList)
    callback && callback()
  })

  socket.on('test film rule', async (data, filmName) => {
    data.isTest = true
    const testBrowser = await puppeteer.launch({
      headless: false,
      executablePath: pkg.executablePath
    })
    const testCallback = createCallback(data)
    testCallback(data.url, testBrowser, filmName)
  })

  socket.on('disconnect', async function () {
    browserBack && await browserBack.close()
    browserBack = null
  })
}
module.exports = run
