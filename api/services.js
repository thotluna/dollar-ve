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
		currentCurrency.increase = (currentDollar - lastDollar) * 100 / (lastDollar + currentDollar)
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
	const tweets = username.map(value => {
		return getTweets(value).sort((a, b) => a.created_at - b.created_b).reverse().slice(0, 2)
	})
  return tweets.map(([current, last]) => {
    current.increase = (current.dollar - last.dollar) * 100 / (current.dollar + last.dollar)
    return current
  })
}
