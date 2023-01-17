import { readDBFile, writeDBFile } from './index.js'

export async function save(dbName, data) {
	await writeDBFile(dbName, data)
}

export async function getAll(dbName) {
	return await readDBFile(dbName)
}

export async function getAllByUsername(dbName, username) {
	const db = getAll(dbName)
	return db.filter(value => value.name === username)
}

export async function getLastTweetByUsername(dbName, username) {
	return await getAllByUsername(dbName, username).at(-1)
}

export async function getLastTweetsObj(dbName) {
	const tweets = await getAll(dbName)
	return tweets.reduce((acc, tweet) => {
		if (!acc[tweet.name]) {
			acc[tweet.name] = tweet
		} else if (acc[tweet.name].created_at < tweet.created_at) {
			acc[tweet.name] = tweet
		}

		return acc
	}, {})
}

export async function getLastTweets(dbName) {
	const tweets = await getAll(dbName)
	const current = tweets.reduce((acc, tweet) => {
		if (!acc[tweet.name]) {
			acc[tweet.name] = tweet
		} else if (acc[tweet.name].created_at < tweet.created_at) {
			acc[tweet.name] = tweet
		}

		return acc
	}, {})
	const tweetsList = Object.entries(current)

	return tweetsList.map(([key, value]) => value)
}

export async function getLastWeekByUsername(username) {
	const dbName = username === 'bcv' ? 'bcv' : 'TWITTER'
	return getAllByUsername(dbName, username)
}
