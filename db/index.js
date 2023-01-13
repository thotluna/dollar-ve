import { writeFile, readFile, access } from 'node:fs/promises'
import path from 'node:path'

const DB_PATH = path.join(process.cwd(), './db/')

export async function readDBFile (dbName) {
  await existsFile(dbName)
  return readFile(`${DB_PATH}/${dbName}.json`, 'utf-8').then(JSON.parse)
}

export async function writeDBFile (dbName, data) {
  return await writeFile(`${DB_PATH}/${dbName}.json`, JSON.stringify(data, null, 2), 'utf-8')
}

async function cratedFile (dbName) {
  await writeDBFile(dbName, [])
}

async function existsFile (dbName) {
  try {
    await access(`${DB_PATH}/${dbName}.json`, true)
  } catch (error) {
    await cratedFile(dbName)
  }
}
