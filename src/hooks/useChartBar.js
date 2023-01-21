import Chart from 'chart.js/auto'
import { useEffect } from 'react'

export function useChartBar(ref, keys, values) {
	const min = Math.min(...values.map((value) => Number(value))) - 0.5
	const max = Math.max(...values.map((value) => Number(value))) + 0.5

	const chart = async () => {
		const canvas = ref.current
		const ctx = canvas.getContext('2d')

		Chart.defaults.font.size = 10
		Chart.defaults.backgroundColor = 'rgba(74, 222, 128, .5)'
		Chart.defaults.borderColor = '#94A3B8'
		Chart.defaults.color = '#94A3B8'

		new Chart(ctx, {
			type: 'bar',
			data: {
				labels: keys,
				datasets: [
					{
						label: null,
						data: values,
						backgroundColor: 'rgba(74, 222, 128, .5)'
					}
				]
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
	}

	useEffect(() => {
		chart()
	})
}
