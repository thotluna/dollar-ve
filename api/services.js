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

const searchLastBcv = (acc, value) => {
  if (value === undefined) return {}
  if (acc.date === undefined) {
    acc = { name: 'BCV', created_at: 0 }
  }

  acc = acc.created_at < value.created_at
    ? { name: 'BCV', ...value }
    : acc
  return acc
}

export const getLastBcv = () => {
  return [BCV.reduce(searchLastBcv, {})]
}
