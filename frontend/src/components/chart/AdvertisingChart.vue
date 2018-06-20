<template>
	<div class="echarts">
		<IEcharts :option="chartData" :resizable="true" ref="chart"></IEcharts>
	</div>
</template>

<script>
import IEcharts from 'vue-echarts-v3'
import 'echarts/lib/chart/bar'

export default {
	name: 'Advertising',
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
		}
	},
	mounted () {
		// console.log('mounted', this.$refs.chart.instance)
	},
	methods: {
	}
}
</script>
