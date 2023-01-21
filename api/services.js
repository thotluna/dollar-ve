import Twitter from '../db/twitter.json'
import BCV from '../db/bcv.json'

const getLastTwitter = (acc, value) => {
	const userTwitter = value.name
	if (acc[userTwitter] === undefined) acc[userTwitter] = value
	acc[userTwitter] = acc[userTwitter].id < value.id ? value : acc[userTwitter]
	return acc
}

export const getLastsTwitter = () => {
	const obj = Twitter.reduce(getLastTwitter, {})
	return Object.entries(obj).map(([key, value]) => value)
}

export const getLastBcv = () => {
	const list = BCV.sort((a, b) => a.created_at - b.created_at).reverse()
	const currentCurrency = list[0]
	const currentDollarString = currentCurrency.dollar.replace('.', '')
	const currentDollar = Number(currentDollarString)
	const lastDollarString = list[1].dollar.replace('.', '')
	const lastDollar = Number(lastDollarString)
	currentCurrency.name = 'BCV'
	if (isNaN(lastDollar)) {
		currentCurrency.increase = 0
	} else {
		currentCurrency.increase = ((currentDollar - lastDollar) * 100) / (lastDollar + currentDollar)
	}
	return [currentCurrency]
}

export const getUserTwitter = () => {
	return Twitter.reduce((acc, value) => {
		if (!acc.includes(value.name)) {
			acc.push(value.name)
		}
		return acc
	}, [])
}

export const getTweets = (username) => {
	return Twitter.filter(({ name }) => name === username)
}

export const currencyForTwitter = () => {
	const username = getUserTwitter()
	const tweets = username.map((value) => {
		return getTweets(value)
			.sort((a, b) => a.created_at - b.created_b)
			.reverse()
			.slice(0, 2)
	})
	return tweets.map(([current, last]) => {
		current.increase = ((current.dollar - last.dollar) * 100) / (current.dollar + last.dollar)
		return current
	})
}

export const getLastWeekByUsername = (username) => {
	const list = username === 'bcv' ? BCV : getTweets(username)

	const today = new Date()
	const date = today.setDate(today.getDate() - 7)

	const filtered = list
		.filter((value) => new Date(value.created_at).getTime() >= date)
		.reduce((acc, value) => {
			const date = new Intl.DateTimeFormat('es-ES').format(new Date(value.created_at))

			const data = {
				name: username,
				date,
				dollar: value.dollar,
				created_at: value.created_at
			}

			if (!acc[`${date}`]) {
				acc[`${date}`] = data
			} else {
				acc[`${date}`] = acc[`${date}`].date < value.created_at ? data : acc[`${date}`]
			}

			return acc
		}, {})

	const filteredEntries = Object.entries(filtered)

	return filteredEntries.map(([, value]) => value).reverse()
}

export const getAllWeekLast = () => {
	const username = getUserTwitter()
	username.push('bcv')
	username.reverse()

	const list = username.map((value) => {
		return getLastWeekByUsername(value)
	})

	return list.map((value) => {
		const current = value[0]
		const last = value[1]

		return {
			dollar: current.dollar,
			created_at: current.created_at,
			name: current.name === 'bcv' ? 'BCV_ORG_VE' : current.name,
			increase:
				((Number(current.dollar) - Number(last.dollar)) * 100) /
				(Number(current.dollar) + Number(last.dollar)),
			list: value
		}
	})
}
