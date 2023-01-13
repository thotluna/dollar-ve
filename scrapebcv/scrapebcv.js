import * as cheerio from 'cheerio'
import { readDBFile, writeDBFile } from '../db/index.js'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
const URL_BCV = 'https://www.bcv.org.ve/'
const BCV_FILE_NAME = 'bcv'

export const cleanText = (text) =>
  text
    .replace(/\t|\n|\s:/g, '')
    .replace(/.*:/g, ' ')
    .trim()

export async function scrape (url) {
  const response = await fetch(url, { rejectUnauthorized: false })
  const html = await response.text()
  return cheerio.load(html)
}

export async function getCurrency () {
  const $ = await scrape(URL_BCV)
  const $table = await $('.view-tipo-de-cambio-oficial-del-bcv')
  const result = {}
  result.dollar = cleanText($table.find('#dolar .centrado').text())
  result.euro = cleanText($table.find('#euro .centrado').text())
  const dateHtml = $table.find('.date-display-single')
  result.date = new Date(dateHtml.attr('content'))

  return result
}

export async function scrapeBCV () {
  const currencies = await getCurrency()
  const bcvRead = await readDBFile(BCV_FILE_NAME)
  let maxTimestamp
  if (bcvRead.length > 0) {
    const lastDate = bcvRead.at(-1) ?? 0
    maxTimestamp = new Date(lastDate.date).getTime()
  } else {
    maxTimestamp = new Date('1970-01-01').getTime()
  }

  const currencyTimestamp = new Date(currencies.date).getTime()
  if (currencyTimestamp > maxTimestamp) {
    const db = [...bcvRead, currencies]
    await writeDBFile(BCV_FILE_NAME, db)
  }
}
