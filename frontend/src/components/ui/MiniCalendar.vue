<template>
	<div class="vue_calendar">
		<div class="inner_vue_calendar">
			<div class="calendar_year" @blur="hide">
				<div class="calendar_inner_wrap">
					<div class="year_inner_wrap" v-on:click="onShow" >
						<div class="year_wrap">
							<ul class="year_on" v-bind:class="this.pArrowUp">
								<li>{{ todayYear }}년</li>
								<li class="month_wrap" v-if="isActive == 2">
									<span>{{ todayMonth }}월</span>
								</li>
							</ul>
						</div>
					</div>
					<div class="direction_btn">
						<button type="button" class="prev" @click="calendarPrevClick()"></button>
						<button type="button" class="next y_disable" @click="calendarNextClick()"></button>
					</div>
				</div>
			</div>
			<div class="calendar_view_wrap" :style="this.selectViewStyle">
				<!-- 연도 -->
				<div v-if="isActive == 1 || isActive == 2" class="calendar_year_view">
					<ul>
						<li :class="todayYear === date ? 'on':''" @click="calendarClickEvent(1, date)" v-for="date in this.dateData.year">{{ date }}년</li>
					</ul>
				</div>
				<!-- 월 -->
				<div v-if="isActive == 2" class="calendar_month_view">
					<ul>
						<li :class="todayMonth === date ? 'on':''" @click="calendarClickEvent(2, date)" v-for="date in this.dateData.month">{{ date }}월</li>
					</ul>
				</div>
			</div>
			<!-- 캘린더 연 월 버튼 -->
			<div class="year_month_btn">
				<div class="radio-toolbar">
					<input type="radio" id="radio1" name="radios" value="all" checked=""><label for="radio1" :class="isActive == 1 ? 'active':''" @click="calendarSelect(1)">월</label>
					<input type="radio" id="radio2" name="radios" value="false"><label for="radio2" :class="isActive != 1 ? 'active':''" @click="calendarSelect(2)">일</label>
				</div>
			</div>
			<!-- // 캘린더 연 월 버튼 -->
		</div>
	</div>
</template>



<script>
export default {
	name: 'MiniCalendar',
	components: {
	},
	mounted () {
		this.calendarDateFormatter()
	},
	data () {
		return {
			isActive: 1,
			selectViewStyle: {
				display: 'none'
			},
			pArrowUp: '',
			todayYear:'',
			todayMonth:'',
			dateData: {
				year: [],
				month: []
			},
			minYear: 2016
		}
	},
	watch: {
		todayYear (value) {
			if (this.isActive === 1) {
				this.$parent.changeDate(value, 0)
			}
		},
		todayMonth (value) {
			if (this.isActive === 2) {
				this.$parent.changeDate(this.todayYear, value)
			}
		}
	},
	methods: {
		calendarDateFormatter () {
			const today = new Date()
			let todayYy = today.getFullYear()
			let todayMm = today.getMonth() + 1
			const stopPointYy = this.minYear
			const count = todayYy - stopPointYy
			this.todayYear = todayYy
			this.todayMonth = todayMm
			//연도
			for(let i = 0; i <= count; i++) {
				this.dateData.year.push(todayYy)
				todayYy--
			}

			//월
			for(let i = 1; i <= 12; i++) {
				this.dateData.month.push(i)
			}
		},
		calendarSelect (activeNumber) {
			this.isActive = activeNumber

			const today = new Date()
			let todayYy = today.getFullYear()
			let todayMm = today.getMonth() + 1
			if (activeNumber === 2) {
				if (this.todayYear === todayYy) {
					this.todayMonth = todayMm
				} else {
					this.todayMonth = 12
				}
			}
			if (activeNumber === 1) {
				this.$parent.changeDate(this.todayYear, 0)
			} else if (activeNumber === 2) {
				this.$parent.changeDate(this.todayYear, this.todayMonth)
			}
		},
		calendarClickEvent (number, date) {
			const today = new Date()
			let todayYy = today.getFullYear()
			let todayMm = today.getMonth() + 1

			if (this.isActive === number) {
				document.removeEventListener('click', this.dc)
				this.selectViewStyle.display = 'none'
				this.pArrowUp = ''
				this.btnActive = ''
			}

			if (String(date).length === 4) {
				if (this.todayYear === date) {
					this.$parent.changeDate(date, 0)
				}
				this.todayYear = date
			} else {
				if (this.todayMonth === date) {
					this.$parent.changeDate(this.todayYear, date)
				}
				if (this.todayYear === todayYy && todayMm < date) {
					this.todayMonth = todayMm
				} else {
					this.todayMonth = date
				}
			}
		},
		calendarPrevClick () {
			if (this.isActive == 1) {
				// 년 변경할 때,
				if (this.todayYear > this.minYear) {
					this.todayYear = this.todayYear - 1
				}
			} else if (this.isActive == 2) {
				// 월 변경할 때,
				if (this.todayMonth > 1) {
					this.todayMonth = this.todayMonth - 1
				}
			}
		},
		calendarNextClick () {
			const today = new Date()
			let todayYy = today.getFullYear()
			let todayMm = today.getMonth() + 1

			if (this.isActive === 1) {
				// 년 변경할 떄,
				if (this.todayYear < todayYy) {
					this.todayYear = this.todayYear + 1
				}
			} else if (this.isActive === 2) {
				// 월 변경할 때,
				if (this.todayMonth < 12) {
					if (this.todayYear === todayYy && this.todayMonth === todayMm) {
						// 현재 월 보다 이후로 넘어가지 않게 하자.
					} else {
						this.todayMonth = this.todayMonth + 1
					}
				}
			}
		},
		dc(e) {
			const check = this.$el.contains(e.target)
			if(check === false) {
				document.removeEventListener('click', this.dc)
				this.selectViewStyle.display = 'none'
				this.pArrowUp = ''
				this.btnActive = ''
			}
		},
		onShow: function () {
			if (this.selectViewStyle.display === 'none') {
				document.addEventListener('click', this.dc)
				this.pArrowUp = 'arrow_up'
				this.btnActive = 'active'
				this.selectViewStyle.display = 'block'
			} else {
				document.removeEventListener('click', this.dc)
				this.pArrowUp = ''
				this.btnActive = ''
				this.selectViewStyle.display = 'none'
			}
		},

		hide:function() {
			this.pArrowUp = ''
			this.selectViewStyle.display = 'none'
		}
		// minicalendarView () {
		// 	let $calendarDepth = document.getElementsByClassName('view_btn')
		// 	calendarDepth.style.display = "block"
		// },
	}
}
</script>


<style lang="scss" scoped>
.vue_calendar{
	.inner_vue_calendar{position:relative;
		.calendar_year{width:220px; margin:0 auto; font-size:31px; font-weight:bold; color:#333; text-align:center;
			.calendar_inner_wrap{position:relative;
				.year_on{background:url(../../assets/images/icon/target_down.png) right 13px no-repeat; cursor:pointer; padding: 0px 21px;}
				.year_on.arrow_up{background:url(../../assets/images/icon/target_up.png) right 13px no-repeat;}
				.year_inner_wrap{margin:0 auto; position:relative; cursor:pointer;
					.year_wrap{display: inline-block; vertical-align: middle; text-align: left;
						ul{
							li{display:inline-block; vertical-align:middle;}
						}
					}
					// .month_wrap{padding-right:15px;}
				}
				.direction_btn{
					.prev{width:11px; height:18px; position:absolute; top:8px; left:-20px; z-index:10; background:url(../../assets/images/icon/cal_prev_btn.png) 0px 0px no-repeat; background-size:11px 18px;}
					.next{width:11px; height:19px; position:absolute; top:8px; right:-20px; z-index:10; background:url(../../assets/images/icon/cal_next_btn.png) 0px 0px no-repeat; background-size:11px 19px;}
				}
			}
		}
		.calendar_view_wrap{border:2px solid #d0d0d0; display:table; position:absolute; top:36px; left: 50%; z-index:100; transform: translate(-50%);
			.on{background:#375b96; color:#fff;}
			ul{
				li{height:53px; line-height:53px; text-align:center; cursor:pointer; background:#fff;
					&:hover{background:#375b96; color:#fff;}
				}
			}
			.calendar_year_view{width:128px; height:159px; float:left; background:#fff;
				// &::-webkit-scrollbar{width: 5px; height: 5px; background-color: #F5F5F5;}
				// &::-webkit-scrollbar-thumb{background-color: #375b96;}
				// &::-webkit-scrollbar-track{-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3); background-color: #F5F5F5;}
			}
			.calendar_month_view{width:128px; height:159px; overflow-y:scroll; float:right; border-left:2px solid #d0d0d0;
				// &::-webkit-scrollbar{width: 5px; height: 5px; background-color: #F5F5F5;}
				// &::-webkit-scrollbar-thumb{background-color: #375b96;}
				// &::-webkit-scrollbar-track{-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3); background-color: #F5F5F5;}
			}
		}
	}
	.year_month_btn{position:absolute; top:0px; right:0px; z-index:10;
			button{width:53px; height:40px; line-height:40px; border:1px solid #d0d0d0;}
			label{width: 53px; height: 40px; line-height: 40px; border: 1px solid #d0d0d0; display: inline-block; text-align: center; cursor:pointer; border-radius: 4px;}
			label:before{margin:0px; display:inline;}
			.active{width: 53px; height: 40px; display: inline-block; text-align: center; line-height: 40px; background:#375b96; color:#fff;  border:1px solid #375b96;}
			// .active,input[type="radio"]:checked + label{width: 53px; height: 40px; display: inline-block; text-align: center; line-height: 40px; background:#375b96; color:#fff;  border:1px solid #375b96;}
		}
}
</style>
