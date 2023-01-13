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
    acc = { created_at: 0 }
  }

  acc = acc.created_at < value.created_at
    ? value
    : acc
  return acc
}

export const getLastBcv = () => {
  return BCV.reduce(searchLastBcv, {})
}
