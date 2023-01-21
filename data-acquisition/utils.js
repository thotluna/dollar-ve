import { logError, logSuccess } from '../utils/log.js'

export function loggingStatusFetch(url, status) {
	if (status === 200) {
		logSuccess(`Fetch to ${url} Status:  ${status}`)
	} else {
		logError(`Error fetching ${url} status: ${status}`)
	}
}

export function filterCurrencies(currentCurrency, currenciesSaved) {
	if (currenciesSaved.length === 0) return currentCurrency
	const lastCurrency = currenciesSaved.at(-1)
	const currentCurrencyFiltered = currentCurrency.filter(
		(currency) => currency.created_at > lastCurrency.created_at
	)
	if (currentCurrencyFiltered.length === 0) return []
	return [...currenciesSaved, ...currentCurrencyFiltered].sort(
		(a, b) => a.created_at - b.created_at
	)
}
