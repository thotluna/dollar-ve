
import { useRef } from 'react'
import { useChartBar } from '../hooks/useChartBar'

export function ChartCurrency({ list }) {
	const canvasRef = useRef()

	const key = list.map(value => value.date).reverse()
	const dollars = list.map(value => value.dollar).reverse()

	useChartBar(canvasRef, key, dollars)

	return (
		<div style={{ width: '200px' }}>
			<canvas style={{ width: '200px' }} ref={canvasRef}>Si ves este mensaje es porque tu navegador no soporta canvas</canvas>
		</div>
	)
}
