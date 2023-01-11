import * as cheerio from 'cheerio'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
const URL_BCV = 'https://www.bcv.org.ve/'

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
  result.date = new Date(cleanText(dateHtml.attr().content))

  return result
}
