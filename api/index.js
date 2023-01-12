import { Hono } from 'hono'
import twitter from '../db/twitter.json'
import bcv from '../db/bcv.json'
import { getLastBcv, getLastsTwitter } from './services'

const app = new Hono()

app.get('/', (context) => {
  const result = {
    bcv: getLastBcv(),
    twitter: getLastsTwitter()
  }
  return context.json(result)
})

app.get('/twitter', (context) => {
  return context.json(twitter)
})

app.get('/bcv', (context) => {
  return context.json(bcv)
})

export default app
