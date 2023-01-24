// @ts-check
import { createWriteStream } from 'node:fs'
import { readFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { Currency } from '../models/Currency.js'

import { logInfo, logSuccess } from '../utils/log.js'

export const DB_PATH = path.join(process.cwd(), './db/data.db')
// TODO: create env develop file and env production file

export function save(...currencies) {
	const save = createWriteStream(DB_PATH, { flags: 'a', encoding: 'utf-8' })
	for (let i = 0; i < currencies.length; i++) {
		save.write(currencies[i].toString())
		logSuccess(currencies[i].toString())
	}
	save.end()
}

export async function read() {
	const data = await readFile(DB_PATH, 'utf-8')
	const dataArr = data.split('\n')
	dataArr.length = dataArr.length - 1

	const res = dataArr.map(value => Currency.createToDb(value))
	return res
}

export async function removeDb() {
	const remove = await rm(DB_PATH)
	logInfo('delete db')
}
