import { getCurrency } from './scrapebcv/scrapebcv.js'
import { getTwit } from './twitter/index.js'

// const currencies = await getCurrency()

// TODO: save currencies in db

const twits = await getTwit()

const sort = twits.sort((a, b) => a.id - b.id)

console.log({ sort })
