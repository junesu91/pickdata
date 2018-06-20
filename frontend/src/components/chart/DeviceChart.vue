<template>
	<div class="echarts">
		<IEcharts :option="chartData" :resizable="true"></IEcharts>
	</div>
</template>

<script>
import IEcharts from 'vue-echarts-v3'
import 'echarts/lib/chart/pie'

export default {
	name: 'DeviceChart',

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
			pie: {
				title: {
					text: '',
					left: 'center',
					top: 20,
					textStyle: {

					}
				},
				visualMap: {
					show: false,
					min: 80,
					max: 600,
					inRange: {
						colorLightness: [0, 1]
					}
				},
				grid: {
				},
				tooltip: {},
				series : [{
					name:'디바이스',
					type:'pie',
					center: ['50%', '50%'],
					data:[
						{value:200, name:'PC'},
						{value:310, name:'MOBILE'},
					].sort(function (a, b) { return a.value - b.value; }),
					// roseType: 'radius',
					label: {
						normal: {
							textStyle: {
							}
						}
					},
					labelLine: {
						normal: {
							lineStyle: {
							}
						}
					},
					itemStyle: {
						normal: {
							color: '#222933',
							shadowBlur: 5
						}
					},
					animationType: 'scale',
					animationEasing: 'elasticOut',
					animationDelay: function (idx) {
						return Math.random() * 200;
					}
				}]
			}
		}
	}
}

</script>
<style lang="scss" scoped>
</style>
