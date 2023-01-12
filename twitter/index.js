import { readDBFile, writeDBFile } from '../db/index.js'

const URL_TWITTER = 'https://api.twitter.com/2/tweets/search/recent?query=from:'
const TWITTER_FILE_NAME = 'twitter'

const SEARCH_SITES = [
  { name: 'MonitorDolarVla', url: 'monitordolarvla', fun: getTwitMonitorDolarVla },
  { name: 'Precio del dólar', url: 'negrodolar', fun: getTwitPrecioDelDolar }
]

export const cleanText = (text) =>
  text
    .replace(/\t|\n|\s:/g, '')
    .replace(/.*:/g, ' ')
    .trim()

const getData = (dataDirtty) => {
  const data = dataDirtty.text
  const getDate = data => data.match(/([0-9]{2,4})+(\/|-)+([0-9]{2})+(\/|-)+([0-9]{2,4})/)[0]
  const getTime = data => data.match(/([0-9]{1,2}):([0-9]{2})/)[0]
  const getMeridian = data => data.match(/([AM])|([PM])/)[0]

  const getDateFull = (date, time, meridian) => {
    const nDate = /^([0-9]){2}/.test(date) ? date.split('/').reverse().join('-') : date
    const nTime = /^([0-9]){2}/.test(time) ? time : `0${time}`
    return new Date(`${nDate}T${nTime}:00.000Z`)
  }

  const getAmount = data => {
    const amountArr = data.match(/([0-9]{2,4})+(,|\.)+([0-9]{1,2})/)[0]
    const amount = /,/.test(amountArr) ? amountArr.replace(',', '.') : amountArr

    return Number(amount)
  }
  return {
    time: getDateFull(getDate(data), getTime(data), getMeridian(data)),
    amount: getAmount(data)
  }
}

export async function getDataByFetch (url) {
  const token = process.env.BEARER_TOKEN
  const options = {
    headers: {
      authorization: `Bearer ${token}`
    }
  }

  const response = await fetch(URL_TWITTER + url + '&tweet.fields=created_at', options)
  const res = await response.json()
  return res.data
}

function getTwitMonitorDolarVla (name, data) {
  const result = []

  data.forEach(value => {
    const arrText = value.text.split('\n')
    const dateTextdirty = cleanText(arrText[0])
    if (!isNaN(Date.parse(dateTextdirty))) {
      const res = getData(value)
      res.id = value.id
      res.name = name
      res.created_at = value.created_at

      result.push(res)
    }
  })

  return result
}

function getTwitPrecioDelDolar (name, dataDirty) {
  const result = []
  dataDirty.forEach((value) => {
    const res = getData(value)
    res.id = value.id
    res.name = name.replace(' ', '')
    res.created_at = value.created_at
    result.push(res)
  })
  return result
}

export async function getTwit () {
  let result = []
  for (const value of SEARCH_SITES) {
    const { name, url, fun } = value

    const data = await getDataByFetch(url)
    result = result.concat(fun(name, data))
  }
  return result.sort((a, b) => a.id - b.id)
}

export async function scraperTwitter () {
  const twits = await getTwit()
  const dbRead = await readDBFile(TWITTER_FILE_NAME)
  const idMax = Math.max(...dbRead.map(value => value.id))
  const twitsSave = twits.filter(value => value.id > idMax)

  if (twitsSave.length > 0) {
    const db = [...dbRead, ...twitsSave]
    await writeDBFile(TWITTER_FILE_NAME, db)
  }
}
