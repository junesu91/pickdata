<template>
	<div class="modal-mask">
		<div class="modal-wrapper">
			<div class="modal-container">
				<div class="layer-pop-widget">
					<div class="popup-widget" id="target_chart">
						<div class="popup-contents clearfix">
							<div class="pop_title_wrap">
								<div class="pop_title">타겟 Chart</div>
								<p class="popup-btn"><button type="button" id="close-btn" class="close-btn close_pop" @click="$emit('close')"><img src="../../assets/images/target/white_close_i.png" alt=""></button></p>
							</div>
							<div class="target_chart_graph_wrap">
								<div class="target_chart_graph_inner clearfix ">
									<div class="target_chart_select clearfix">
										<div class="select_btn">
											<div class="select_contents">
												<!-- <div class="select"><p>오늘:2017/11/13</p></div> -->
												<ui-calendar inputId="chartDate" v-model="range"></ui-calendar>
												<button type="button" id="chart-search-btn" @click="chartsDatas" v-if="chartOn">조회</button>
												<button type="button" id="chart-search-btn" v-if="!chartOn"><img src="../../assets/images/icon/loading.gif" alt="로딩중" class="loading-img"></button>
											</div>
										</div>
									</div>
									<div class="target_chart_top clearfix">
										<div class="use_limit clearfix">
											<div class="clearfix">
												<span>{{ chartName }}</span>
												<ui-hover></ui-hover>
											</div>
											<strong v-if="!chartOn">-</strong>
											<strong class="clearfix" v-if="chartOn">{{ total.audience }}명</strong>
											<div class="conversion_prologue clearfix">
												<span>전환 기준 : {{conversion_criteria}}</span>
											</div>
										</div>
										<div class="expense_price">
											<p>총 지출 금액(원)</p>
											<p v-if="!chartOn">-</p>
											<p v-if="chartOn">{{ total.spend }}</p>
										</div>
										<div class="all_switch">
											<p>총 전환</p>
											<p v-if="!chartOn">-</p>
											<p v-if="chartOn">{{ total.convertion }}</p>
										</div>
										<div class="cpa_chart">
											<p>CPA</p>
											<p v-if="!chartOn">-</p>
											<p v-if="chartOn">{{ total.cpa }}</p>
										</div>
									</div>
									<div class="target_chart_wrap">
										<div>
											<h2>인구 통계학적 특성</h2>
											<div class="graph_type01">
												<ui-partial-loading  v-if="!chartOn" />
												<ui-charts :chartData="this.chartGenderData" v-if="chartOn"></ui-charts>
											</div>
										</div>
										<div>
											<h2>노출위치</h2>
											<div class="graph_type02">
												<ui-partial-loading v-if="!chartOn" />
												<ui-charts :chartData="this.chartPlacementData" v-if="chartOn"></ui-charts>
											</div>
										</div>
									</div>
								</div>
								<div class="chart_close_btn close_pop" @click="$emit('close')">닫기</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// UI
import Select from '@/components/ui/Select'
import Charts from '@/components/ui/Charts'
import Calendar from '@/components/ui/Calendar'
import Hover from '@/components/ui/Hover'
import PartialLoading from '@/components/ui/PartialLoading'
import { numberToFixed, numberFormatter } from '@/components/utils/Formatter'

export default {
	name: 'TargetChart',

  components: {
		'ui-select': Select,
		'ui-charts': Charts,
		'ui-calendar': Calendar,
		'ui-hover': Hover,
		'ui-partial-loading': PartialLoading
  },

  props:{
  	chartItem: {
  		type:Object
  	},
  	scrollPop: {
      type: Function,
      default () {
        return false
      }
    }
  },

  created() {
  	this.chartsDatas()
  },
	mounted () {
	},

  data () {
		return {
			//loading
			chartOn:false,
			//chartName
			chartName:"-",
			//totalData
			total:{
				audience:0,
				conversion:0,
				spend:0,
				cta:0
			},
			//chartGenderData
			chartGenderData: {
				//legend: ['남성 50%(3,250)','여성 50%(3,250)'],
				legend: ['남성','여성'],
				xAxis: ['13-17세','18-24세','25-34세','35-44세','45-54세','55-64세','65세이상'],
				yAxis: {
					'type':'value',
					'name':'%',
					'max':100
				},

				series:[
					{
						//name:'남성 50%(3,250)',
						name:'남성',
						type:'bar',
						data:[],
						barWidth: '10%',

						itemStyle:{
							normal: {
								label : {
									show: true,
									position: 'insideRight',
									formatter: '{c}%'
								},
								color: '#58cefc'
							}
						}
					},

					{
						//name:'여성 50%(3,250)',
						name:'여성',
						type:'bar',
						data:[],
						barWidth: '10%',
						itemStyle:{
							normal: {
								label : {
									show: true,
									position: 'insideLeft',
									formatter: '{c}%'
								},
								color: '#ff81c0'
							}
						}
					}
				]
			},

			//chartPlacementData
			chartPlacementData:{
				//네임
				legend: [],

				//X데이터 네임
				xAxis: [],

				yAxis: {
					'type':'value',
					//'name':'K'
					'name':''
				},

				//순차적 데이터
				series:[
					{
						name: 'PC',
						type: 'bar',
						data: [],
						barWidth: '5%',
						itemStyle: {
							normal: {
								label : {
									show: true,
									position: 'insideRight',
									//formatter: '{c}K'
									formatter: '{c}'

								},
								color: '#267aa9'
							}
						}
					},
					{
						name: 'Mobile',
						type: 'bar',
						data: [],
						barWidth: '5%',
						itemStyle: {
							normal: {
								label: {
									show: true,
									position: 'insideLeft',
									//formatter: '{c}K'
									formatter: '{c}'
								},

								color:'#45ceb4'
							}
						}
					}
				]
			},

			//calendar
			show: false,
			time: new Date(),
			range: [new Date(),new Date()],
			emptyTime: '',
			emptyRange: [],
			local: {
				type: Object,
				default () {
					return {
						dow: 0, // Sunday is the first day of the week
						hourTip: 'Select Hour', // tip of select hour
						minuteTip: 'Select Minute', // tip of select minute
						secondTip: 'Select Second', // tip of select second
						yearSuffix: '', // suffix of head year
						yearSuffix: '년', // format of head
						monthsHead: '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split('_'), // months of head
						months: '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split('_'), // months of panel
						weeks: '일_월_화_수_목_금_토'.split('_') // weeks
					}
				}
			}
		}
  },
  methods: {
  	chartsRedatas(data) {
  		const reDatas = []
  		for(let i = 0; i < data.length; i++) {
  			reDatas.push(numberToFixed(data[i], 2))
  		}
  		return reDatas
  	},
  	chartsDatas() {
  		this.chartOn = false
  		const targetId = this.chartItem.id

			/*
			const dateVal = ''
			if (document.getElementById('chartDate') != null){
				const dateVal = document.getElementById('chartDate').value.replace(/\s/gi, "")
			}else{
				const dateVal = ''
			}

	  	//오늘날짜
	  	const d = new Date;
			const yy = d.getFullYear()
			const mm = ((d.getMonth() + 1) < 10) ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)
			const dd = (d.getDate() < 10) ? '0' + d.getDate() : d.getDate()

			let firstDate = yy + '-' + mm + '-' + dd
			let endDate = firstDate

	  	if(dateVal != '') {
				const dateSplit = dateVal.split('~')
				firstDate = dateSplit[0]
				endDate = dateSplit[1]
			}
			*/

			var date_range = []
			this.range.forEach(date => {
				date_range.push(date.toISOString().split('T')[0])
			})

	  	this.$http.get('/pickdata_account_target/target_chart', {
	  		params: {
				pickdata_target_id:targetId,
				start_date:date_range[0],
				end_date:date_range[1]
			}
	    })
	    .then(res => {
	      const response = res.data
	      const success = response.success
	      if (success === 'YES') {
	      	//네임
	      	this.chartName = response.name
	      	//totalData
	      	this.total.audience = numberFormatter(response.audience_count)
	      	this.total.convertion = numberFormatter(response.total_conversion)
	      	this.total.spend = numberFormatter(response.total_spend)
	      	this.total.cpa = numberFormatter(Math.round(response.cpa))
	      	//genderData
	      	this.chartGenderData.series[0]['data'] = this.chartsRedatas(response.age_gender_data.data.male.percents)
	      	this.chartGenderData.series[1]['data'] = this.chartsRedatas(response.age_gender_data.data.female.percents)
	      	//placementsData
	      	this.chartPlacementData['legend'] = response.placement_data.legend
	      	this.chartPlacementData['xAxis'] = response.placement_data.xAxis
	      	this.chartPlacementData.series[0]['data'] = response.placement_data.data.PC.vals
	      	this.chartPlacementData.series[1]['data'] = response.placement_data.data.Mobile.vals
			this.conversion_criteria = response.conversion_criteria
	      	this.chartOn = true
	      	const me = this
	      	setTimeout(function() {
	      		me.scrollPop()
	      	}, 100)
	      }else{
	      	throw('success: ' + success)
	      }
	    })
  	}
  }
}
</script>

<style lang="css" scoped>
.graph_type01,
.graph_type02 { overflow:hidden; }
.select_btn { width:460px; }
.vue-calendar { float:left; width:350px; }
#chart-search-btn { float:right; width:100px; height:40px; line-height:40px; background:#375b96; text-align:center; color:#fff; }
.loading-img { display:block; width:20px; }
</style>
