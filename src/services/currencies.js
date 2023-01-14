export async function getCurrencies() {
	try {
		const response = await fetch('http://localhost:8787/current')
		const json = await response.json()
		return json.data
	} catch (e) {
		// enviar el error a un servicio de reporte de errores
		return null
	}
}
