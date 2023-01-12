import { Hono } from 'hono'
import twitter from '../db/twitter.json'
import bcv from '../db/bcv.json'
import { getLastBcv, getLastsTwitter } from './services'

const app = new Hono()

app.get('/', (context) => {
  return context.json([
    {
      endpoint: '/current',
      description: 'Current prices of the dollar with respect to the bolivar'
    },
    {
      endpoint: '/bcv',
      description: 'historical prices of the dollar according to BCV since January 12, 2023'
    },
    {
      endpoint: '/twitter',
      description: 'Historical prices of the dollar according to several users on Twitter since January 12, 2023'
    }
  ])
})

app.get('/current', (context) => {
  const result = {
    bcv: getLastBcv(),
    twitter: getLastsTwitter()
  }
  return context.json({
    return: '/',
    data: result
  })
})

app.get('/twitter', (context) => {
  return context.json({
    return: '/',
    data: twitter
  })
})

app.get('/bcv', (context) => {
  return context.json({
    return: '/',
    data: bcv
  })
})

export default app
