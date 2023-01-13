import { writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'

import { logInfo } from '../utils/log.js'

const DB_PATH = path.join(process.cwd(), './db/')

export async function readDBFile (dbName) {
  return readFile(`${DB_PATH}/${dbName}.json`, 'utf-8').then(JSON.parse)
}

export async function writeDBFile (dbName, data) {
  logInfo(`Save in db ${dbName}`)
  return await writeFile(`${DB_PATH}/${dbName}.json`, JSON.stringify(data, null, 2), 'utf-8')
}
