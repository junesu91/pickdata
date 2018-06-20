<template>
	<div class="echarts">
		<IEcharts :option="chartData" :resizable="true"></IEcharts>
	</div>
</template>

<script>
import IEcharts from 'vue-echarts-v3'
import 'echarts/lib/chart/bar'

export default {
	name: 'PublicationChart',
	components: {
		IEcharts
	},
	props: {
		chartData: {
			type: Object,
			default () {
				return {
				}
			}
		}
	},
	data () {
		return {
			bar: {
				color: ['#46ceb5'],
				tooltip : {
					trigger: 'axis',
					axisPointer : {
						type : 'shadow'
					}
				},
				grid: {
					left: '3%',
					right: '4%',
					containLabel: true
				},
				xAxis : [
					{
						type : 'category',
						data : ['Facebook', 'Audience Network', 'Instagram', 'Messanger'],
						axisTick: {
							alignWithLabel: true
						}
					}
				],
				yAxis : [
					{
						type : 'value'
					}
				],
				series : [
					{
						name: 'PC',
						type: 'bar',
						stack: '2',
						itemStyle: {
							normal: {
								label : {
									show: true,
									position: '',
									//formatter: '{c}K'
									formatter: '{c}'

								},
								color: '#375b96'
							}
						},

						data: [320, 302, 301, 334]
					},
					{
						name: 'MOBILE',
						type: 'bar',
						stack: '2',
						itemStyle: {
							normal: {
								label : {
									show: true,
									position: '',
									//formatter: '{c}K'
									formatter: '{c}'

								},
								color: '#c5cce2'
							}
						},
						data: [120, 132, 101, 134]
					}
				],
				legend: {
					data:['PC','MOBILE'],
					bottom : 0
				}
			}
		}
	}
}

</script>
<style lang="scss" scoped>
</style>
