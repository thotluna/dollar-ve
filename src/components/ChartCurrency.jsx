import { useRef } from 'react'
import { useChartBar } from '../hooks/useChartBar'

export function ChartCurrency({ list }) {
	const canvasRef = useRef()

	const key = list.map((value) => value.date).reverse()
	const dollars = list.map((value) => value.dollar).reverse()

	useChartBar(canvasRef, key, dollars)

	return (
		<div className='w-40 sm:w-52'>
			<canvas className='w-40 sm:w-52' ref={canvasRef}>
				Si ves este mensaje es porque tu navegador no soporta canvas
			</canvas>
		</div>
	)
}
