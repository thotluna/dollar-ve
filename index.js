import { getCurrency } from './scrapebcv/scrapebcv.js'
import { getTwit } from './twitter/index.js'

// const currencies = await getCurrency()

// TODO: save currencies in db

const twits = await getTwit()

console.log({ twits })
