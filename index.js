import { getCurrency } from './scrapebcv/scrapebcv.js'

const currencies = await getCurrency()
console.log(currencies)
