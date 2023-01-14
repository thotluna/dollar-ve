import { readDBFile, writeDBFile } from '../../db/index.js'
import { filterCurrencies, loggingStatusFetch } from '../utils.js'

const URL_TWITTER = 'https://api.twitter.com/2/tweets/search/recent?tweet.fields=created_at&query=from:'
const TWITTER_FILE_NAME = 'twitter'

const SEARCH_SITES = [
  { name: 'MonitorDolarVla', url: 'monitordolarvla', fun: getTwitMonitorDolarVla },
  { name: 'Preciodeldolar', url: 'negrodolar', fun: getTwitPrecioDelDolar },
  { name: 'DolarToday', url: 'DolarToday', fun: getDolarToday }
]

export const cleanText = (text) =>
  text
    .replace(/\t|\n|\s:/g, '')
    .replace(/.*:/g, ' ')
    .trim()

export async function fetching (url) {
  const API_TOKEN = process.env.API_TOKEN
  const options = { headers: { authorization: `Bearer ${API_TOKEN}` } }
  const urlFull = `${URL_TWITTER}${url}`

  const response = await fetch(urlFull, options)
  loggingStatusFetch(urlFull, response.status)
  const res = await response.json()
  return res.data
}

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
    dollar: getAmount(data)
  }
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
      res.created_at = new Date(value.created_at).getTime()

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
    res.created_at = new Date(value.created_at).getTime()
    result.push(res)
  })
  return result
}

function getDolarToday (name, dataDirty) {
  // Así cotiza el $ a esta hora BsF. 21,20 y el € a BsF. 19,93 entra sin bloqueos

  const getData = (dirty) => {
    const dividido = dirty.split('y el € a BsF.')
    const currencies = dividido.map(value => Number(value.match(/([0-9]{2,4})+(,|\.)+([0-9]{1,2})/)[0].replace(',', '.')))
    return {
      dollar: currencies[0],
      euro: currencies[1]
    }
  }
  const result = []
  dataDirty.forEach((value) => {
    if (/Así cotiza el $ a esta hora BsF/.test(value)) {
      const res = getData(value)
      res.created_at = new Date(value.created_at).getTime()
      res.name = name
      res.id = dataDirty.id
      result.push(res)
    }
  })
  return result
}

export async function getTwit () {
  let result = []
  for (const value of SEARCH_SITES) {
    const { url, fun } = value

    const data = await fetching(url)
    if (data === undefined) return
    result = result.concat(fun(url, data))
  }
  return result.sort((a, b) => a.id - b.id)
}

export async function scraperTwitter () {
  const tweets = await getTwit()
  if (tweets === undefined) return
  const dbRead = await readDBFile(TWITTER_FILE_NAME)
  const filtered = filterCurrencies(tweets, dbRead)
  if (filtered.length > 0) {
    await writeDBFile(TWITTER_FILE_NAME, filtered)
  }
}

export async function acquire () {

}
