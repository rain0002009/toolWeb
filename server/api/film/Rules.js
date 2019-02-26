const { URL } = require('url')
const qs = require('querystring')
const consola = require('consola')
const axios = require('axios')
const low = require('lowdb')
const _ = require('lodash')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db.json')
const db = low(adapter)
db.defaults({ filmRuleList: {} }).write()
const ruleList = db.get('filmRuleList').value()
const rules = {}
_.forEach(ruleList, function (value) {
  rules[value.url] = createCallback(value)
})

function addFilm(data) {
  db.get('filmRuleList').push(data).write()
  ruleList.push(data)
  rules[data.url] = createCallback(data)
}

function editFilm(data) {
  consola.log(data)
  const key = data.url
  db.get('filmRuleList').find(['url', key]).assign(data).write()
  ruleList[_.findIndex(ruleList, ['url', key])] = data
  rules[key] = createCallback(data)
}

function createCallback({ needHost, type = 'html', ajaxType = 'post', hasResCheck, filmListQuery, linkQuery, titleQuery = linkQuery, q, needFilter = false }) {
  return async function (urlString, browser, keyWord) {
    const host = new URL(urlString).origin
    const page = await browser.newPage()
    try {
      if (type === 'ajax') {
        const data = await axios[ajaxType](urlString, qs.stringify({ wd: keyWord })).then(({ data }) => data)
        await page.setContent(data)
      }
      if (type === 'html') {
        q = q.replace('#keyWord#', keyWord)
        await page.goto(urlString + q, { timeout: 10000 })
      }
      if (typeof hasResCheck !== 'function') {
        hasResCheck = new Function('page', hasResCheck)
      }
      const hasRes = await hasResCheck(page)
      if (hasRes) {
        let output = await page.$$eval(filmListQuery, (el, { host, needHost, linkQuery, titleQuery }) => {
          return [...el].map((item) => {
            const link = item.querySelector(linkQuery).getAttribute('href')
            const title = item.querySelector(titleQuery).innerText
            return { link: needHost ? host + link : link, title }
          })
        }, { host, needHost, linkQuery, titleQuery })
        output = (needFilter ? output.filter(item => item.title.includes(keyWord)) : output)
        await page.close()
        return output
      } else {
        await page.close()
        return []
      }
    } catch (e) {
      consola.log(e)
      return []
    }
  }
}

exports.addFilm = addFilm
exports.editFilm = editFilm
exports.rules = rules
exports.ruleList = ruleList
