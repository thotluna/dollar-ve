import { Config } from '../config'

export async function getCurrencies() {
	try {
		const response = await fetch(`${Config.API_URL_PRODUCTION}${Config.API_ENDPOINT_CURRENT}`)
		const json = await response.json()
		return json.data
	} catch (e) {
		return null
	}
}
