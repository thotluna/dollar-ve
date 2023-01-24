// @ts-check
import { describe, test, expect, beforeEach, afterEach, afterAll } from 'vitest'
import { writeFile } from 'node:fs/promises'
import { Currency } from '../models/Currency.js'
import { read, save, removeDb, DB_PATH } from './handlerDb.js'

const baseCurrent = new Currency('BCV', 20.00, new Date('2023-01-01').getTime())

const onlyCurrency = new Currency('DollarToday', 30.00, new Date('2023-01-02').getTime())

const firstCurrency = new Currency('monitordolarve', 40.00, new Date('2023-01-03').getTime())

const secondCurrency = new Currency('dolarnegro', 50.00, new Date('2023-01-04').getTime())

describe('Db services', () => {
	beforeEach(async () => {
		save(baseCurrent)
	})

	afterEach(async () => {
		await writeFile(DB_PATH, '', 'utf-8')
	})

	afterAll(async () => {
		await writeFile(DB_PATH, '', 'utf-8')
	})

	test('read multiple currencies', async () => {
		setTimeout(async () => {
			const currencies = await read()
			expect(currencies).not.toBeNull()
			expect(currencies.length).toBe(1)
			expect(currencies[0]).toStrictEqual(baseCurrent)
		}, 500)
	})

	test('read zero currencies', async () => {
		await removeDb()
		await writeFile(DB_PATH, '', 'utf-8')
		const currencies = await read()
		expect(currencies).not.toBeNull()
		expect(currencies.length).toBe(0)
	})

  test('save a currency', async () => {
		await save(onlyCurrency)

		setTimeout(async () => {
			const newCurrencies = await read()
			expect(newCurrencies.includes(onlyCurrency)).toBeTruthy()
		}, 1000)
	})

  test('save multiple currencies', () => {
		save(firstCurrency, secondCurrency)

		setTimeout(async () => {
			const newCurrencies = await read()
			expect(newCurrencies.includes(onlyCurrency)).toBeTruthy()
		}, 1000)
	})
})
