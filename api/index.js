import { Hono } from 'hono'
import twitter from '../db/twitter.json'
import bcv from '../db/bcv.json'
import { currencyForTwitter, getLastBcv, getLastWeekByUsername, getAllWeekLast } from './services'

const app = new Hono()

app.get('/', (context) => {
  return context.json([
    {
      endpoint: '/current',
      description: 'Current prices of the dollar with respect to the bolivar'
    },
		{
			endpoint: '/last-week/:username',
			description: 'prices of the dollar form last week '
		},
    {
      endpoint: '/bcv',
      description: 'historical prices of the dollar according to BCV since January 12, 2023'
    },
    {
      endpoint: '/twitter',
      description: 'Historical prices of the dollar according to several users on Twitter since January 12, 2023',
      parameters: [
        {
          name: 'username',
          endpoint: '/twitter/:username',
          description: 'Historical prices of the dollar according to the user on Twitter since January 12, 2023'
        }
      ]
    }
  ])
})

app.get('/current', (context) => {
  const result = [
    getLastBcv(),
    currencyForTwitter()
	].flat()
  return context.json({
    return: '/',
    data: result
  })
})

app.get('/bcv', (context) => {
  return context.json({
    return: '/',
    data: bcv
  })
})

app.get('/twitter', (context) => {
  return context.json({
    return: '/',
    data: twitter
  })
})

app.get('/last-week/:username', (context) => {
  const username = context.req.param('username')

  return context.json({
    return: '/',
    data: getLastWeekByUsername(username)
  })
})

app.get('/current-full', (context) => {
	return context.json({
		return: '/',
		date: getAllWeekLast()
	})
})

app.get('/twitter/:username', (context) => {
  const username = context.req.param('username')

  return context.json({
    return: '/',
    data: twitter.filter(value => value.name === username)
  })
})

export default app
