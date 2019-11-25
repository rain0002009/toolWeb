const { URL } = require('url')
const qs = require('querystring')
const consola = require('consola')
const axios = require('axios')
const low = require('lowdb')
const _ = require('lodash')
const iconv = require('iconv-lite')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db.json')
const db = low(adapter)
db.defaults({ filmRuleList: {} }).write()
const ruleList = db.get('filmRuleList')
const rules = {}
_.forEach(ruleList.value(), function (value) {
  rules[value.url] = createCallback(value)
})

function addFilm (data) {
  ruleList.push(data).write()
  rules[data.url] = createCallback(data)
}

function deleteFilm (url) {
  const item = ruleList.find(['url', url]).value()
  db.get('filmRuleList').remove(item).write()
}

function editFilm (data) {
  const key = data.url
  ruleList.find(['url', key]).assign(data).write()
  rules[key] = createCallback(data)
}

function createCallback ({ needHost, type = 'html', ajaxType = 'post', isTest = false, hasResCheck, charset = 'utf8', filmListQuery, linkQuery, titleQuery = linkQuery, q, needFilter = false }) {
  return async function (urlString, browser, keyWord) {
    const host = new URL(urlString).origin
    const page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36')
    if (typeof hasResCheck !== 'function') {
      // eslint-disable-next-line no-new-func
      hasResCheck = new Function('page', hasResCheck)
    }
    try {
      if (type === 'ajax') {
        const data = await axios[ajaxType](urlString, qs.stringify({ wd: keyWord })).then(({ data }) => data)
        await page.setContent(data)
      }
      if (type === 'html') {
        if (charset.replace('-', '') !== 'utf8') {
          keyWord = [...iconv.encode(keyWord, charset)].map(v => '%' + _.padStart(v.toString(16), 2, '0')).join('')
        }
        await page.goto(urlString + q.replace('#keyWord#', keyWord))
      }
      const hasRes = await hasResCheck(page)
      if (hasRes) {
        let output = await page.$$eval(filmListQuery, (el, { host, needHost, linkQuery, titleQuery }) => {
          return [...el].map((item) => {
            const link = item.querySelector(linkQuery).getAttribute('href')
            const title = item.querySelector(titleQuery).textContent
            return { link: needHost ? host + link : link, title }
          })
        }, { host, needHost, linkQuery, titleQuery })
        output = (needFilter ? output.filter(item => item.title.includes(keyWord)) : output)
        !isTest && await page.close()
        return output
      } else {
        !isTest && await page.close()
        return []
      }
    } catch (e) {
      consola.log(urlString + ' 获取失败')
      consola.log(e)
      return []
    }
  }
}

exports.addFilm = addFilm
exports.editFilm = editFilm
exports.deleteFilm = deleteFilm
exports.rules = rules
exports.ruleList = ruleList.value()
exports.createCallback = createCallback
