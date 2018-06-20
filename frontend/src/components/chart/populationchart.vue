<template>
	<div class="echarts">
		<IEcharts :option="chartData" :resizable="true"></IEcharts>
	</div>
</template>

<script>
import IEcharts from 'vue-echarts-v3'
import 'echarts/lib/chart/bar'
export default {
	name : 'population',
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
				tooltip : {
					trigger: 'axis',
					axisPointer : {
						type : 'shadow'
					},
					formatter: function (params,ticket,callback) {
						if (params.componentType === 'legend') {
							return params.name
						}
						let res = params[0].name
						for (let i = 0, l = params.length; i < l; i++) {
							let val = params[i].value
							if (val < 0) {
								val = val * -1
							}
							res += '<br/>' + params[i].seriesName + ' : ' + val
						}
						return res;
					}
				},
				xAxis : [
					{
						type : 'value',
						axisLabel: {
							formatter: function(value, index) {
								if (value < 0) {
									return value * -1
								} else {
									return value
								}
							}
						}
					}
				],
				yAxis : [
					{
						type : 'category',
						axisTick : {show: true},
						data : ['테스트1','테스트2','테스트3','테스트4','테스트5','테스트6','테스트7']
					}
				],
				legend: {
					data:['남성','여성']
				},
				series : [
					{
						name:'남성',
						type:'bar',
						stack: 'true',
						itemStyle: {
							normal: {
								label: {
									show: true,
									position: 'inside',
									formatter: function (value, index) {
										return value.data * -1
									}
								},
								color: '#57cefb'
							}
						},
						data:[-320, -302, -341, -374, -390, -350, -320]
					},
					{
						name:'여성',
						type:'bar',
						stack: 'true',
						itemStyle: {
							normal: {
								label: {
									show: true,
									position: 'inside',
									formatter: '{c}'
								},
								color: '#ff81bf'
							}
						},
						data:[200, 170, 340, 244, 200, 220, 310]
					}
				]
			}
		}
	}
}
</script>

<style scoped>

</style>
