import * as cheerio from 'cheerio'
import { readDBFile, writeDBFile } from '../../db/index.js'
import { logError, logSuccess } from '../../utils/log.js'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
const URL_BCV = 'https://www.bcv.org.ve/'
const BCV_FILE_NAME = 'bcv'

const FIELS = {
  dollar: { selector: '.view-tipo-de-cambio-oficial-del-bcv #dolar .centrado', type: 'text' },
  euro: { selector: '.view-tipo-de-cambio-oficial-del-bcv #euro .centrado', type: 'text' },
  created_at: { selector: '.view-tipo-de-cambio-oficial-del-bcv .date-display-single', type: 'time' }
}

async function fetching (url) {
  const response = await fetch(url, { rejectUnauthorized: false })
  const status = response.status
  if (status === 200) {
    logSuccess(`Fetch to ${URL_BCV} Status:  ${status}`)
  } else {
    logError(`Error fetching ${URL_BCV} status: ${status}`)
  }
  const html = await response.text()
  return cheerio.load(html)
}

function get ($, selector, type) {
  const element = $(selector)
  let res
  if (type === 'text') {
    res = element.text().trim().replace(/\t|\n|\s:/g, '').replace(',', '.')
  } else {
    res = new Date(element.attr('content')).getTime()
  }
  return res
}

async function getCurrencies ($) {
  const fieldSelectorEntries = Object.entries(FIELS)
  const entries = fieldSelectorEntries.map(([key, { selector, type }]) => {
    const value = get($, selector, type)
    return [key, value]
  })
  const { ...currencies } = Object.fromEntries(entries)

  return currencies
}

function filterCurrencies (currentCurrency, currenciesSaved) {
  if (currenciesSaved.length === 0) return currentCurrency
  const lastCurrency = currenciesSaved.at(-1)
  const currentCurrencyFiltered = currentCurrency.filter(currency => currency.created_at > lastCurrency.created_at)
  if (currentCurrencyFiltered.length === 0) return []
  return [...currenciesSaved, ...currentCurrencyFiltered].sort((a, b) => a.created_at - b.created_at)
}

export async function scrapeAnSaveBCV () {
  const $ = await fetching(URL_BCV)
  const currencies = [await getCurrencies($)]
  const currenciesDb = await readDBFile(BCV_FILE_NAME)
  const filtered = filterCurrencies(currencies, currenciesDb)
  if (filtered.length > 0) {
    await writeDBFile(BCV_FILE_NAME, filtered)
  }
}
