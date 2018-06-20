<template>
	<div id="account_report">
		<div class="target_contents_wrap">
			<div class="target_search_wrap clearfix">
				<div class="cate_select">
					<p>카테고리</p>
					<ui-select :selectData="this.categorySelectData" :onClick="selectCategory"></ui-select>
				</div>
				<div class="admin_select">
					<p>광고계정</p>
					<ui-select :selectData="this.accountSelectData" :onClick="selectAccount"></ui-select>
				</div>
				<button class="report_search" v-show="false">검색</button>
			</div>
			<ui-loading :isShow="isLoading" :titleText="loadingTitle" :descriptionText="loadingDescription"></ui-loading>
			<div class="target_chart_wrap" v-show="!this.isLoading">
				<div class="target_calender_wrap">
					<ui-MiniCalendar v-model="range" ref="mini_calendar"></ui-MiniCalendar>
				</div>
				<div>
					<div class="chart_section">
						<h2>전체 광고비 추이</h2>
						<ui-AdvertisingChart :chartData="this.totalSpendChartData"/>
					</div>
					<div class="chart_section" v-show="this.categorySelectData.emptyText === '전체' && this.accountSelectData.emptyText === '전체'">
						<h2>카테고리별 광고비</h2>
						<ui-CategoryAdvertising :chartData="this.categorySpendChartData" />
					</div>
					<div class="chart_section" v-show="this.categorySelectData.emptyText !== '전체' || this.accountSelectData.emptyText !== '전체'">
						<h2>인구 통계학적 특성</h2>
						<ui-PopulationChart :chartData="this.ageGenderInsightChartData" />
					</div>
					<div class="chart_section chart_last_section">
						<h2>노출위치</h2>
						<div class="left_chart">
							<h3>디바이스별</h3>
							<ui-DeviceChart :chartData="this.deviceChartData" />
						</div>
						<div class="right_chart">
							<h3>게재위치별</h3>
							<ui-PublicationChart :chartData="this.publicationChartData"/>
						</div>
					</div>
				</div>
				<p class="chart_prologue">본 리포트는 픽데이터 등록계정의 광고만을 기준으로 집계되었으므로, 실제 픽셀 전체의 수치와는 차이가 있습니다.</p>
			</div>
		</div>
	</div>
</template>

<script>
// UI
import Loading from '@/components/ui/Loading'
import Select from '@/components/ui/Select'
import MiniCalendar from '@/components/ui/MiniCalendar'
import AdvertisingChart from '@/components/chart/AdvertisingChart'
import DeviceChart from '@/components/chart/DeviceChart'
import PopulationChart from '@/components/chart/PopulationChart'
import PublicationChart from '@/components/chart/PublicationChart'
import CategoryAdvertising from '@/components/chart/CategoryAdvertising'
import { nFormatter, numberFormatter } from '@/components/utils/Formatter'
export default {
	name: 'AccountReport',

	components: {
		'ui-loading': Loading,
		'ui-select': Select,
		'ui-MiniCalendar': MiniCalendar,
		'ui-AdvertisingChart': AdvertisingChart,
		'ui-DeviceChart': DeviceChart,
		'ui-PopulationChart': PopulationChart,
		'ui-PublicationChart': PublicationChart,
		'ui-CategoryAdvertising': CategoryAdvertising
	},
	data () {
		return {
			isLoading: false,
			loadingTitle: '리포트를 가져오는 중입니다.',
			loadingDescription: '조금만 기다려 주시면, 리포트를 가져옵니다.',
			isTotalSpendLoading: false,
			isCategorySpendLoading: false,
			isDeviceLoading: false,
			isPublicationLoading: false,
			isAgeGenderInsightLoading: false,
			range: [new Date(new Date().setDate(new Date().getDate() - 1)), new Date(new Date().setDate(new Date().getDate() - 1))],
			categorySelectData: {
				emptyText: '전체',
				textList: [
					'전체',
					'대출',
					'카드',
					'보험',
					'뷰티',
					'NGO',
					'여행',
					'쇼핑몰',
					'기타'
				],
				keyList: [
					'all',
					'loan',
					'card',
					'insurance',
					'beauty',
					'ngo',
					'travel',
					'shoppingmall',
					'etc'
				]
			},
			accountSelectData: {
				emptyText: '전체',
				textList: [
				],
				keyList: [
				]
			},
			totalSpendChartData: {
				title: {},
				tooltip: {},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: {
					data: []
				},
				yAxis: {
					min: 0,
					axisLabel: {
						formatter: function (value, index) {
							return nFormatter(value, 0)
						}
					}
				},
				series: [{
					name: '광고비',
					type: 'bar',
					itemStyle: {
						normal: {
							label : {
								show: true,
								formatter: function (value, index) {
									if (value.data === 0) {
										return ''
									}
									return nFormatter(value.data, 0)
								}
							}
						}
					},
					data: []
				}]
			},
			categorySpendChartData: {
				color: ['#46ceb5'],
				tooltip: {},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: {
					type: 'category',
					data: [],
					axisTick: {
						alignWithLabel: true
					}
				},
				yAxis: {
					min: 0,
					axisLabel: {
						formatter: function (value, index) {
							return nFormatter(value, 0)
						}
					}
				},
				series: [{
					type: 'bar',
					barWidth: '60%',
					itemStyle: {
						normal: {
							label: {
								show: true,
								position: '',
								//formatter: '{c}K'
								formatter: function (value, index) {
									if (value.data === 0) {
										return ''
									}
									return nFormatter(value.data, 0)
								}
							},
							color: '#375b96'
						}
					},
					data: []
				}]
			},
			deviceChartData: {
				color: ['#375b96', '#c5cce2'],
				title: {
					text: '',
					left: 'center',
					top: 20,
					textStyle: {
					}
				},
				tooltip: {},
				series : [{
					name:'디바이스',
					type:'pie',
					center: ['50%', '50%'],
					data: []
				}]
			},
			publicationChartData: {
				color: ['#46ceb5'],
				tooltip: {},
				grid: {
					left: '3%',
					right: '4%',
					containLabel: true
				},
				xAxis: {
						type : 'category',
						data : [],
						axisTick: {
							alignWithLabel: true
						}
				},
				yAxis: {
					type : 'value',
					min: 0,
					axisLabel: {
						formatter: function (value, index) {
							return nFormatter(value, 0)
						}
					}
				},
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
									formatter: function (value, index) {
										if (value.data === 0) {
											return ''
										}
										return nFormatter(value.data, 0)
									}
								},
								color: '#375b96'
							}
						},
						data: []
					},
					{
						name: '모바일',
						type: 'bar',
						stack: '2',
						itemStyle: {
							normal: {
								label : {
									show: true,
									position: '',
									formatter: function (value, index) {
										if (value.data === 0) {
											return ''
										}
										return nFormatter(value.data, 0)
									}
								},
								color: '#c5cce2'
							}
						},
						data: []
					}
				],
				legend: {
					data:['PC','모바일'],
					bottom : 0
				}
			},
			ageGenderInsightChartData: {
				grid: {
					left: '3%',
					right: '4%',
					containLabel: true
				},
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
							res += '<br/>' + params[i].seriesName + ' : ' + numberFormatter(val)
						}
						return res;
					}
				},
				xAxis: {
					// type : 'value',
					min: null,
					max: null,
					axisLabel: {
						formatter: function(value, index) {
							if (value < 0) {
								return nFormatter((value * -1), 0)
							} else {
								return nFormatter(value, 0)
							}
						}
					}
				},
				yAxis: {
						type : 'category',
						axisTick : {show: true},
						data: []
				},
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
									position: 'left',
									distance: 10,
									formatter: function (value, index) {
										if (value.data === 0) {
											return ''
										}
										return nFormatter((value.data * -1), 0)
									}
								}
								// color: '#57cefb'
							}
						},
						data: []
					},
					{
						name:'여성',
						type:'bar',
						stack: 'true',
						itemStyle: {
							normal: {
								label: {
									show: true,
									position: 'right',
									distance: 10,
									formatter: function (value, index) {
										if (value.data === 0) {
											return ''
										}
										return nFormatter(value.data, 0)
									}
								}
								// color: '#ff81bf'
							}
						},
						data: []
					}
				]
			}
		}
	},
	watch: {
		isTotalSpendLoading (value) {
			this.isLoading = !(this.isTotalSpendLoading && this.isCategorySpendLoading && this.isDeviceLoading && this.isPublicationLoading && this.isAgeGenderInsightLoading)
		},
		isCategorySpendLoading (value) {
			this.isLoading = !(this.isTotalSpendLoading && this.isCategorySpendLoading && this.isDeviceLoading && this.isPublicationLoading && this.isAgeGenderInsightLoading)
		},
		isDeviceLoading (value) {
			this.isLoading = !(this.isTotalSpendLoading && this.isCategorySpendLoading && this.isDeviceLoading && this.isPublicationLoading && this.isAgeGenderInsightLoading)
		},
		isPublicationLoading (value) {
			this.isLoading = !(this.isTotalSpendLoading && this.isCategorySpendLoading && this.isDeviceLoading && this.isPublicationLoading && this.isAgeGenderInsightLoading)
		},
		isAgeGenderInsightLoading (value) {
			this.isLoading = !(this.isTotalSpendLoading && this.isCategorySpendLoading && this.isDeviceLoading && this.isPublicationLoading && this.isAgeGenderInsightLoading)
		}
	},
	created () {
		this.loadFbAdAccounts()
		// this.isLoading = true
		// this.loadAccountTotalSpend(2018, 0)
		// this.loadAccountCategorySpend(2018, 0)
		// this.loadAccountImpressionLocation(2018, 0)
		// this.loadAgeGenderInsight(2018, 0)
	},
	methods: {
		changeDate (year, month) {
			this.isLoading = true
			this.isTotalSpendLoading = false
			this.isCategorySpendLoading = false
			this.isDeviceLoading = false
			this.isPublicationLoading = false
			this.isAgeGenderInsightLoading = false

			this.loadAccountTotalSpend(year, month)
			this.loadAccountCategorySpend(year, month)
			this.loadAccountImpressionLocation(year, month)
			this.loadAgeGenderInsight(year, month)
		},
		loadAccountTotalSpend (year, month) {
			let url = '/account_insight/total_spend'
			this.$http.get(url, {
				params: {
					fb_ad_account_id: this.findSelectKey('accountSelectData'),
					category: this.findSelectKey('categorySelectData'),
					year: year,
					month: month
				}
			})
			.then(res => {
				const response = res.data
				const data = response.data
				const success = response.success
				if (success === "YES") {
					let xAxisData = []
					let seriesData = []
					data.forEach(item => {
						xAxisData.push(item.date)
						seriesData.push(item.spend)
					})
					this.totalSpendChartData.xAxis.data = this.covertTotalSpendxAxisData(xAxisData)
					this.totalSpendChartData.series[0].data = seriesData
					this.isTotalSpendLoading = true
				} else {
					throw('success', success)
				}
			})
			.catch(err => {
				this.isTotalSpendLoading = true
				console.error('/account_insight/total_spend', err)
			})
		},
		loadAccountCategorySpend (year, month) {
			if (this.categorySelectData.emptyText === '전체' && this.accountSelectData.emptyText === '전체') {
				let me = this
				let url = '/account_insight/category_spend'
				this.$http.get(url, {
					params: {
						year: year,
						month: month
					}
				})
				.then(res => {
					const response = res.data
					const data = response.data
					const success = response.success
					if (success === "YES") {
						let xAxisData = []
						let seriesData = []
						Object.keys(data).map(function(key, index) {
							xAxisData.push(me.convertCategoryLabel(key))
							seriesData.push(data[key])
						})
						this.categorySpendChartData.xAxis.data = xAxisData
						this.categorySpendChartData.series[0].data = seriesData
						this.isCategorySpendLoading = true
					} else {
						throw('success', success)
					}
				})
				.catch(err => {
					this.isCategorySpendLoading = true
					console.error('/account_insight/category_spend', err)
				})
			} else {
				this.isCategorySpendLoading = true
			}
		},
		loadAgeGenderInsight (year, month) {
			if (this.categorySelectData.emptyText !== '전체' || this.accountSelectData.emptyText !== '전체') {
				let me = this
				let url = '/account_insight/age_gender_impressions'
				this.$http.get(url, {
					params: {
						fb_ad_account_id: this.findSelectKey('accountSelectData'),
						category: this.findSelectKey('categorySelectData'),
						year: year,
						month: month
					}
				})
				.then(res => {
					const response = res.data
					const ageGenderInsights = response.age_gender_insights
					const success = response.success
					if (success === "YES") {
						let yAxisData = ['13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+']
						let maleData = ageGenderInsights.male
						let femaleData = ageGenderInsights.female
						let maleChartData = []
						let femaleChartData = []
						let maxValue = 0
						yAxisData.forEach(item => {
							if (maleData[item] >= maxValue) {
								maxValue = maleData[item]
							}
							if (femaleData[item] >= maxValue) {
								maxValue = femaleData[item]
							}
							maleChartData.push(maleData[item] * -1)
							femaleChartData.push(femaleData[item])
						})
						maxValue = this.calcMaxValue(maxValue)
						this.ageGenderInsightChartData.xAxis.min = maxValue * -1
						this.ageGenderInsightChartData.xAxis.max = maxValue
						this.ageGenderInsightChartData.yAxis.data = yAxisData
						this.ageGenderInsightChartData.series[0].data = maleChartData
						this.ageGenderInsightChartData.series[1].data = femaleChartData

						this.isAgeGenderInsightLoading = true
					} else {
						throw('success', success)
					}
				})
				.catch(err => {
					this.isAgeGenderInsightLoading = true
					console.error('/account_insight/age_gender_impressions', err)
				})
			} else {
				this.isAgeGenderInsightLoading = true
			}
		},
		loadAccountImpressionLocation (year, month) {
			const me = this
			let url = '/account_insight/placement_impressions'
			this.$http.get(url, {
				params: {
					fb_ad_account_id: this.findSelectKey('accountSelectData'),
					category: this.findSelectKey('categorySelectData'),
					year: year,
					month: month
				}
			})
			.then(res => {
				const response = res.data
				const platformData = response.platform_data
				const deviceData = response.device_data
				const success = response.success
				if (success === "YES") {
					let deviceChartData = []
					Object.keys(deviceData).map(function(key, index) {
						deviceChartData.push({
							name: me.convertDeviceLabel(key),
							value: deviceData[key]
						})
					})
					this.deviceChartData.series[0].data = deviceChartData

					let xAxisData = ['facebook', 'instagram', 'messenger', 'audience_network']
					let convertXAxisData = []
					let pcData = []
					let mobileData = []
					xAxisData.forEach(item => {
						convertXAxisData.push(me.convertLocationLabel(item))
						pcData.push(platformData[item]['pc'])
						mobileData.push(platformData[item]['mobile'])
					})
					this.publicationChartData.xAxis.data = convertXAxisData
					this.publicationChartData.series[0].data = pcData
					this.publicationChartData.series[1].data = mobileData

					this.isDeviceLoading = true
					this.isPublicationLoading = true
				} else {
					throw('success', success)
				}
			})
			.catch(err => {
				this.isDeviceLoading = true
				this.isPublicationLoading = true
				console.error('/account_insight/total_spend', err)
			})
		},
		loadFbAdAccounts () {
			// fb_ad_accounts/accounts_by_category
			// DB 저장 된 광고 계정 리스트 가져오기
			let url = '/fb_ad_accounts/accounts_by_category'
			this.$http.get(url, {
				params: {
					account_category: this.findSelectKey('categorySelectData')
				}
			})
			.then(res => {
				const response = res.data
				const data = response.data
				const success = response.success

				if (success === "YES") {
					if (data.length > 0) {
						var accountNameList = []
						var acountIdList = []
						data.forEach(item => {
							accountNameList.push(item.name)
							acountIdList.push(item.ad_account_id)
						})
						this.accountSelectData.textList = accountNameList
						this.accountSelectData.keyList = acountIdList
						this.accountSelectData.textList.splice(0, 0, "전체")
						this.accountSelectData.keyList.splice(0, 0, 0)
						this.accountSelectData.emptyText = accountNameList[0]
					} else {
						this.accountSelectData.emptyText = '광고주 없음'
						this.accountSelectData.textList = []
						this.accountSelectData.keyList = []
					}
				}
			})
			.catch(err => {
				console.error('/fb_ad_accounts/accounts_by_category', err)
			})
		},
		findSelectKey (selectName) {
			/*
			Select Key 가져오기
			//this.findSelectKey('accountSelectData')
			*/
			const emptyText = this[selectName].emptyText
			const textList = this[selectName].textList
			const keyList = this[selectName].keyList
			return keyList[textList.indexOf(emptyText)]
		},
		selectCategory (item) {
			this.categorySelectData.emptyText = item
			this.loadFbAdAccounts()

			let mCalendar = this.$refs.mini_calendar
			if (mCalendar.isActive == 1) {
				this.changeDate(mCalendar.todayYear, 0)
			}
			if (mCalendar.isActive == 2) {
				this.changeDate(mCalendar.todayYear, mCalendar.todayMonth)
			}
		},
		selectAccount (item) {
			this.accountSelectData.emptyText = item

			let mCalendar = this.$refs.mini_calendar
			if (mCalendar.isActive == 1) {
				this.changeDate(mCalendar.todayYear, 0)
			}
			if (mCalendar.isActive == 2) {
				this.changeDate(mCalendar.todayYear, mCalendar.todayMonth)
			}
		},
		covertTotalSpendxAxisData (data) {
			if (data.length === 0) {
				return []
			}
			let dateStr = data[0]
			if (dateStr.length === 7) {
				// 년도별 데이터
				return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
			} else {
				// 월별 데이터
				let dateList = []
				let year = parseInt(dateStr.substr(0, 4))
				let month = parseInt(dateStr.substr(5, 2))
				let d = new Date(year, month, 0)
				let lastDay = d.getDate()

				for (let i=1; i<=lastDay; i++) {
					dateList.push(i)
				}
				return dateList
			}
		},
		convertCategoryLabel (name) {
			if (name === 'beauty') {
				return '뷰티'
			} else if (name === 'shoppingmall') {
				return '쇼핑몰'
			} else if (name === 'ngo') {
				return 'NGO'
			} else if (name === 'travel') {
				return '여행'
			} else if (name === 'card') {
				return '카드'
			} else if (name === 'insurance') {
				return '보험'
			} else if (name === 'loan') {
				return '대출'
			} else if (name === 'etc') {
				return '기타'
			} else {
				return name
			}
		},
		convertDeviceLabel (name) {
			if (name === 'pc') {
				return 'PC'
			} else if (name === 'mobile') {
				return '모바일'
			} else {
				return name
			}
		},
		convertLocationLabel (name) {
			if (name === 'facebook') {
				return 'Facebook'
			} else if (name === 'instagram') {
				return 'Instagram'
			} else if (name === 'messenger') {
				return 'Messenger'
			} else if (name === 'audience_network') {
				return 'Audience Network'
			} else {
				return name
			}
		},
		calcMaxValue (value) {
			try {
				let str = '' + value
				let maxNum = 1
				for (let i=1; i<str.length; i++) {
					maxNum *= 10
				}
				return (parseInt(str[0]) + 1) * maxNum
			} catch (e) {
				return value
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.target_chart_wrap{background:#fff; padding:25px 35px;
	h2{font-size:18px; color:#333; margin-bottom:35px;}
	.chart_section{margin-top:35px; padding-bottom:35px; border-bottom:1px solid #e5e5e5;}
	.chart_last_section{width:100%; display:table; border-bottom:0px; padding-bottom:0px;
		h3{font-size:16px; color:#333; text-align:center;}
		.left_chart{width:30%; float:left; border-right:1px solid #e5e5e5;}
		.right_chart{width:70%; float:left;}
	}
	.chart_prologue{color:#bcbcbc; padding-top:75px;}
	.target_calender_wrap{position:relative;
		.year_month_btn{position:absolute; top:0px; right:0px; z-index:10;
			button{width:53px; height:40px; line-height:40px; border:1px solid #d0d0d0;}
			label{width: 53px; height: 40px; line-height: 40px; border: 1px solid #d0d0d0; display: inline-block; text-align: center; cursor:pointer; border-radius: 4px;}
			label:before{margin:0px; display:inline;}
			input[type="radio"]:checked + label{width: 53px; height: 40px; display: inline-block; text-align: center; line-height: 40px; background:#375b96; color:#fff;  border:1px solid #375b96;}
		}
	}
}
</style>
