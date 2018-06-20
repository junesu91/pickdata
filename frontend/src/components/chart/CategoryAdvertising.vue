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
		}
	}
}

</script>
<style lang="scss" scoped>
</style>
