import Twitter from '../db/twitter.json'
import BCV from '../db/bcv.json'

const getLastTwitter = (acc, value) => {
  const userTwitter = value.name
  if (acc[userTwitter] === undefined) acc[userTwitter] = value
  acc[userTwitter] = acc[userTwitter].id < value.id ? value : acc[userTwitter]
  return acc
}

export const getLastsTwitter = () => {
  return Twitter.reduce(getLastTwitter, {})
}

const searchLastBcv = (acc, value) => {
  if (value === undefined) return {}
  if (acc.date === undefined) {
    acc = { date: '1970/01/01' }
  }

  acc = new Date(acc.date).getTime() < new Date(value.date).getTime()
    ? value
    : acc
  return acc
}

export const getLastBcv = () => {
  return BCV.reduce(searchLastBcv, {})
}
