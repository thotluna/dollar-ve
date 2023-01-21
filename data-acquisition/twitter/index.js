import { readDBFile, writeDBFile } from '../../db/index.js'
import { filterCurrencies, loggingStatusFetch } from '../utils.js'
import { getLastTweets } from '../../db/crud.js'

const URL_TWITTER = 'https://api.twitter.com/2/tweets/search/recent'
const TWITTER_FILE_NAME = 'twitter'

const getUrl = (username, date) => {
	const dateIso = new Date(date).toISOString()
	let url = `${URL_TWITTER}?tweet.fields=created_at&query=from:${username}`
	if (date) {
		url += `&start_time=${dateIso}`
	}
	return url
}

const SEARCH_SITES = [
	{ name: 'MonitorDolarVla', username: 'monitordolarvla', fun: getTwitMonitorDolarVla },
	{ name: 'Preciodeldolar', username: 'negrodolar', fun: getTwitPrecioDelDolar },
	{ name: 'DolarToday', username: 'DolarToday', fun: getDolarToday }
]

export const cleanText = (text) =>
	text
		.replace(/\t|\n|\s:/g, '')
		.replace(/.*:/g, ' ')
		.trim()

export async function fetching(username, date) {
	const API_TOKEN = process.env.API_TOKEN
	const options = { headers: { authorization: `Bearer ${API_TOKEN}` } }
	const urlFull = getUrl(username, date)

	const response = await fetch(urlFull, options)
	loggingStatusFetch(urlFull, response.status)
	const res = await response.json()
	return res.data
}

const getData = (dataDirtty) => {
	const data = dataDirtty.text
	const getDate = (data) => data.match(/([0-9]{2,4})+(\/|-)+([0-9]{2})+(\/|-)+([0-9]{2,4})/)[0]
	const getTime = (data) => data.match(/([0-9]{1,2}):([0-9]{2})/)[0]
	const getMeridian = (data) => data.match(/([AM])|([PM])/)[0]

	const getDateFull = (date, time, meridian) => {
		const nDate = /^([0-9]){2}/.test(date) ? date.split('/').reverse().join('-') : date
		const nTime = /^([0-9]){2}/.test(time) ? time : `0${time}`
		return new Date(`${nDate}T${nTime}:00.000Z`)
	}

	const getAmount = (data) => {
		let amountArr = data.match(/([0-9]{2,4})+(,|\.)+([0-9]{1,2})/)
		if (!amountArr) {
			amountArr = data.match(/(?!%:-\/)( [1-9]{1,4} )/)
			if (!amountArr) return
		}
		amountArr = amountArr[0]
		const amount = /,/.test(amountArr) ? amountArr.replace(',', '.') : amountArr

		return Number(amount)
	}
	return {
		time: getDateFull(getDate(data), getTime(data), getMeridian(data)),
		dollar: getAmount(data)
	}
}

function getTwitMonitorDolarVla(name, data) {
	const result = []

	data.forEach((value) => {
		const arrText = value.text.split('\n')
		if (/([0-9]{2})+\/+([0-9]{2})+\/([0-9]{4})/.test(arrText[0])) {
			const res = getData(value)
			res.id = value.id
			res.name = name
			res.created_at = new Date(value.created_at).getTime()
			res.data = value.text
			result.push(res)
		}
	})

	return result
}

function getTwitPrecioDelDolar(name, data) {
	const result = []
	data.forEach((value) => {
		const res = getData(value)
		res.id = value.id
		res.name = name.replace(' ', '')
		res.created_at = new Date(value.created_at).getTime()
		res.data = value.text
		result.push(res)
	})
	return result
}

function getDolarToday(name, data) {
	// Así cotiza el $ a esta hora BsF. 21,20 y el € a BsF. 19,93 entra sin bloqueos
	const getData = (dirty) => {
		const dividido = dirty.split('y el € a BsF.')

		const currencies = dividido.map((value) =>
			Number(value.match(/([0-9]{2,4})+(,|\.)+([0-9]{1,2})/)[0].replace(',', '.'))
		)
		return {
			dollar: currencies[0],
			euro: currencies[1]
		}
	}
	const result = []
	data.forEach((value) => {
		if (/esta hora BsF/.test(value.text)) {
			const res = getData(value.text)
			res.created_at = new Date(value.created_at).getTime()
			res.name = name
			res.id = data.id
			res.data = value.text
			result.push(res)
		}
	})
	return result
}

export async function getTwit() {
	let result = []
	for (const value of SEARCH_SITES) {
		const { username, fun } = value
		const lasts = await getLastTweets(TWITTER_FILE_NAME)
		const lastCreatedAt = lasts.reduce((acc, value) => {
			acc = value.name === username ? value : acc
			return acc
		})

		const data = lastCreatedAt
			? await fetching(username, lastCreatedAt.created_at)
			: await fetching(username)
		if (data === undefined) return
		result = result.concat(fun(username, data))
	}
	return result.sort((a, b) => a.id - b.id)
}

export async function scraperTwitter() {
	const tweets = await getTwit()

	if (tweets === undefined) return
	const dbRead = await readDBFile(TWITTER_FILE_NAME)

	const filtered = filterCurrencies(tweets, dbRead)
	if (filtered.length > 0) {
		await writeDBFile(TWITTER_FILE_NAME, filtered)
	}
}

export async function acquire() {}
