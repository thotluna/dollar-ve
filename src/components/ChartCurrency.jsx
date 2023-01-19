
import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

export function ChartCurrency({ list }) {
	const canvasRef = useRef()

	const key = list.map(value => value.date).reverse()
	const dollars = list.map(value => value.dollar).reverse()
	console.log({ key, dollars })
	const min = Math.min(...dollars.map(value => Number(value))) - 0.5
	const max = Math.max(...dollars.map(value => Number(value))) + 0.5

	useEffect(() => {
		const canvas = canvasRef.current
		const ctx = canvas.getContext('2d')

		Chart.defaults.font.size = 10
		Chart.defaults.borderColor = '#94A3B8'
		Chart.defaults.color = '#CBD5E1'

		const chart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: key,
				datasets: [{
					label: null,
					data: dollars
				}]
			},
			options: {
				responsive: true,
				plugins: {
					legend: {
						display: false
					}
				},
				scales: {
					x: {
						display: true,
						title: {
							display: false
						}
					},
					y: {
						display: true,
						title: {
							display: false
						},
						min,
						max
					}
				}
			}
		})
	})

	return (
		<div style={{ width: '200px' }}>
			<canvas style={{ width: '200px' }} ref={canvasRef}>Si ves este mensaje es porque tu navegador no soporta canvas</canvas>
		</div>
	)
}
