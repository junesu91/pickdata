<template>
	<div id="set_report">
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
				<div class="data_select">
					<p>기간</p>
					<div class="select_btn">
						<div class="select_contents">
							<ui-calendar v-model="range"></ui-calendar>
						</div>
					</div>
				</div>
				<button class="report_search" v-on:click="getGridData()">검색</button>
			</div>
			<ui-loading :isShow="isLoading" :titleText="loadingTitle" :descriptionText="loadingDescription"></ui-loading>
			<div class="target_report_wrap" v-if="isReport">
				<div class="target_setup">
					<div class="select_btn">
						<div class="select_contents control-select">
							<div class="select" v-on:click="sortSelectOnOff()"><p>열 맞춤 설정</p></div>
							<ul class="select_view control_view" v-if="this.sortSelectData.onShow">
								<li v-for="item in this.sortSelectData.listData"><input type="checkbox" v-bind:id="item.setting.checkId" v-on:change="sortSelectFilter(item)" :checked="item.setting.checked"><label v-bind:for="item.setting.checkId">{{ item.setting.name }}</label></li>
							</ul>
						</div>
					</div>
					<button>
						<span>
							<img src="../../assets/images/icon/excel_icon.png" alt="">
						</span>
						<span v-on:click="downloadReport()">엑셀로 내보내기</span>
					</button>
				</div>
				<div class="target_report_contents">
					<div id="report-list-wrap" class="report_contents_inner_wrap" v-on:scroll="this.contentScroll">
						<div id="report-list-inner">
							<div id="report-list" class="contents_inner" :style="{height:reSizeHeight + 'px'}">
								<div class="table_head">
									<ul id="report-list-head-1" class="head_th table_default clearfix">
										<li class="line-1 report-line left_default" v-if="sortSelectData.listData[0].setting.show">광고주</li>
										<li class="line-2 normal_depth report-line left_default" v-if="sortSelectData.listData[1].setting.show">캠페인명</li>
									</ul>
								</div>
								<div class="table_body">
									<div class="table_body_inner" v-for="(item, index) in listData.data">
										<ul class="body_th clearfix">
											<li class="line-1" v-if="sortSelectData.listData[0].setting.show"><div class="line-inner">{{ item.account_name }}</div></li>
											<li class="line-2 normal_depth" v-if="sortSelectData.listData[1].setting.show"><div class="line-inner">{{ item.campaign_name }}</div></li>
										</ul>
									</div>
								</div>
							</div>
							<div id="report-list-2" class="contents_inner" :style="{height:reSizeHeight + 'px'}">
								<div class="table_head">
									<ul id="report-list-head-2" class="head_th table_default clearfix">
										<li class="line-3 report-line" v-if="sortSelectData.listData[2].setting.show">기간</li>
										<li class="line-4 normal_depth report-line" v-if="sortSelectData.listData[3].setting.show">광고세트</li>
										<li class="line-5">픽데이터 타겟</li><!-- 추가 -->
										<li class="line-6 report-line" v-if="sortSelectData.listData[4].setting.show">연령</li>
										<li class="line-7 report-line" v-if="sortSelectData.listData[5].setting.show">성별</li>
										<li class="line-8 report-line" v-if="sortSelectData.listData[6].setting.show">관심사 개수</li>
										<li class="line-9 normal_depth report-line" v-if="sortSelectData.listData[7].setting.show">맞춤타겟 이름</li>
										<li class="line-10 report-line" v-if="sortSelectData.listData[8].setting.show">
											<span>광고비</span>
											<span class="sort_type_01">
												<div>
													<p><a href="javascript:void(0)" v-on:click="listSort('spend','ASC')" class="asc_sort sort_btn"></a></p>
													<p><a href="javascript:void(0)" v-on:click="listSort('spend','DESC')" class="desc_sort sort_btn"></a></p>
												</div>
											</span>
										</li>
										<li class="line-11 report-line" v-if="sortSelectData.listData[9].setting.show">
											<span>노출</span>
											<span class="sort_type_01">
												<div>
													<p><a href="javascript:void(0)" v-on:click="listSort('impressions','ASC')" class="asc_sort sort_btn"></a></p>
													<p><a href="javascript:void(0)" v-on:click="listSort('impressions','DESC')" class="desc_sort sort_btn"></a></p>
												</div>
											</span>
										</li>
										<li class="line-12 report-line" v-if="sortSelectData.listData[10].setting.show">
											<span>도달</span>
											<span class="sort_type_01">
												<div>
													<p><a href="javascript:void(0)" v-on:click="listSort('reach','ASC')" class="asc_sort sort_btn"></a></p>
													<p><a href="javascript:void(0)" v-on:click="listSort('reach','DESC')" class="desc_sort sort_btn"></a></p>
												</div>
											</span>
										</li>
										<li class="line-13 report-line" v-if="sortSelectData.listData[11].setting.show">
											<span>도달빈도</span>
											<span class="sort_type_01">
												<div>
													<p><a href="javascript:void(0)" v-on:click="listSort('frequency','ASC')" class="asc_sort sort_btn"></a></p>
													<p><a href="javascript:void(0)" v-on:click="listSort('frequency','DESC')" class="desc_sort sort_btn"></a></p>
												</div>
											</span>
										</li>
										<li class="line-14 th_sub depth1 report-line" v-if="sortSelectData.listData[12].setting.show">
											<dl>
												<dt>사이트 유입 지표</dt>
												<dd>
													<ul class="clearfix">
														<li v-if="sortSelectData.listData[12].setting.show">
															<span>링크클릭</span>
															<span class="sort_type_02">
																<div>
																	<p><a href="javascript:void(0)" v-on:click="listSort('inline_link_clicks','ASC')" class="asc_sort sort_btn"></a></p>
																	<p><a href="javascript:void(0)" v-on:click="listSort('inline_link_clicks','DESC')" class="desc_sort sort_btn"></a></p>
																</div>
															</span>
														</li>
														<li v-if="sortSelectData.listData[12].setting.show">
															<span>CTR</span>
															<span class="sort_type_02">
																<div>
																	<p><a href="javascript:void(0)" v-on:click="listSort('inline_link_click_ctr','ASC')" class="asc_sort sort_btn"></a></p>
																	<p><a href="javascript:void(0)" v-on:click="listSort('inline_link_click_ctr','DESC')" class="desc_sort sort_btn"></a></p>
																</div>
															</span>
														</li>
														<li v-if="sortSelectData.listData[12].setting.show">
															<span>CPC</span>
															<span class="sort_type_02">
																<div>
																	<p><a href="javascript:void(0)" v-on:click="listSort('inline_link_click_cpc','ASC')" class="asc_sort sort_btn"></a></p>
																	<p><a href="javascript:void(0)" v-on:click="listSort('inline_link_click_cpc','DESC')" class="desc_sort sort_btn"></a></p>
																</div>
															</span>
														</li>
													</ul>
												</dd>
											</dl>
										</li>
										<li class="line-15 depth2 report-line" v-if="sortSelectData.listData[13].setting.show">
											<span>슬라이드 소재</span>
										</li>
										<li class="line-16 th_sub depth3 report-line" v-if="sortSelectData.listData[14].setting.show">
											<dl>
												<dt>영상캠페인 지표</dt>
												<dd>
													<ul class="clearfix">
														<li v-if="sortSelectData.listData[14].setting.show">
															<span>3초 이상 View</span>
															<span class="sort_type_02">
																<div>
																	<p><a href="javascript:void(0)" v-on:click="listSort('video_10_sec_watched_actions','ASC')" class="asc_sort sort_btn"></a></p>
																	<p><a href="javascript:void(0)" v-on:click="listSort('video_10_sec_watched_actions','DESC')" class="desc_sort sort_btn"></a></p>
																</div>
															</span>
														</li>
														<li v-if="sortSelectData.listData[14].setting.show">
															<span>3초 이상 VTR</span>
															<span class="sort_type_02">
																<div>
																	<p><a href="javascript:void(0)" v-on:click="listSort('video_10_sec_watched_vtr','ASC')" class="asc_sort sort_btn"></a></p>
																	<p><a href="javascript:void(0)" v-on:click="listSort('video_10_sec_watched_vtr','DESC')" class="desc_sort sort_btn"></a></p>
																</div>
															</span>
														</li>
														<li v-if="sortSelectData.listData[14].setting.show">
															<span>3초 이상 CPV</span>
															<span class="sort_type_02">
																<div>
																	<p><a href="javascript:void(0)" v-on:click="listSort('video_10_sec_watched_cpv','ASC')" class="asc_sort sort_btn"></a></p>
																	<p><a href="javascript:void(0)" v-on:click="listSort('video_10_sec_watched_cpv','DESC')" class="desc_sort sort_btn"></a></p>
																</div>
															</span>
														</li>
													</ul>
												</dd>
											</dl>
										</li>
										<li class="line-17 th_sub depth4 report-line" v-if="sortSelectData.listData[15].setting.show">
											<dl>
												<dt>전환 지표</dt>
												<dd>
													<ul class="clearfix">
														<li v-if="sortSelectData.listData[15].setting.show">
															<span>전환 완료</span>
															<span class="sort_type_02">
																<div>
																	<p><a href="javascript:void(0)" v-on:click="listSort('pickdata_custom_conv_total','ASC')" class="asc_sort sort_btn"></a></p>
																	<p><a href="javascript:void(0)" v-on:click="listSort('pickdata_custom_conv_total','DESC')" class="desc_sort sort_btn"></a></p>
																</div>
															</span>
														</li>
														<li v-if="sortSelectData.listData[15].setting.show">
															<span>전환 완료 가치</span>
															<span class="sort_type_02">
																<div>
																	<p><a href="javascript:void(0)" v-on:click="listSort('pickdata_custom_conv_total_cost','ASC')" class="asc_sort sort_btn"></a></p>
																	<p><a href="javascript:void(0)" v-on:click="listSort('pickdata_custom_conv_total_cost','DESC')" class="desc_sort sort_btn"></a></p>
																</div>
															</span>
														</li>
														<li v-if="sortSelectData.listData[15].setting.show">
															<span>1단계 완료</span>
															<span class="sort_type_02">
																<div>
																	<p><a href="javascript:void(0)" v-on:click="listSort('pickdata_custom_conv_first','ASC')" class="asc_sort sort_btn"></a></p>
																	<p><a href="javascript:void(0)" v-on:click="listSort('pickdata_custom_conv_first','DESC')" class="desc_sort sort_btn"></a></p>
																</div>
															</span>
														</li>
														<li v-if="sortSelectData.listData[15].setting.show">
															<span>2단계 완료</span>
															<span class="sort_type_02">
																<div>
																	<p><a href="javascript:void(0)" v-on:click="listSort('pickdata_custom_conv_second','ASC')" class="asc_sort sort_btn"></a></p>
																	<p><a href="javascript:void(0)" v-on:click="listSort('pickdata_custom_conv_second','DESC')" class="desc_sort sort_btn"></a></p>
																</div>
															</span>
														</li>
														<li v-if="sortSelectData.listData[15].setting.show">
															<span>3단계 완료</span>
															<span class="sort_type_02">
																<div>
																	<p><a href="javascript:void(0)" v-on:click="listSort('pickdata_custom_conv_third','ASC')" class="asc_sort sort_btn"></a></p>
																	<p><a href="javascript:void(0)" v-on:click="listSort('pickdata_custom_conv_third','DESC')" class="desc_sort sort_btn"></a></p>
																</div>
															</span>
														</li>
														<li v-if="sortSelectData.listData[15].setting.show">
															<span>4단계 완료</span>
															<span class="sort_type_02">
																<div>
																	<p><a href="javascript:void(0)" v-on:click="listSort('pickdata_custom_conv_fourth','ASC')" class="asc_sort sort_btn"></a></p>
																	<p><a href="javascript:void(0)" v-on:click="listSort('pickdata_custom_conv_fourth','DESC')" class="desc_sort sort_btn"></a></p>
																</div>
															</span>
														</li>
														<li v-if="sortSelectData.listData[15].setting.show">
															<span>5단계 완료</span>
															<span class="sort_type_02">
																<div>
																	<p><a href="javascript:void(0)" v-on:click="listSort('pickdata_custom_conv_fifth','ASC')" class="asc_sort sort_btn"></a></p>
																	<p><a href="javascript:void(0)" v-on:click="listSort('pickdata_custom_conv_fifth','DESC')" class="desc_sort sort_btn"></a></p>
																</div>
															</span>
														</li>
													</ul>
												</dd>
											</dl>
										</li>
										<li class="line-18 th_sub depth5 report-line" v-if="sortSelectData.listData[16].setting.show">
											<dl>
												<dt>페이지 참여 지표</dt>
												<dd>
													<ul class="clearfix">
														<li v-if="sortSelectData.listData[16].setting.show">
															<span>공유</span>
															<span class="sort_type_02">
																<div>
																	<p><a href="javascript:void(0)" v-on:click="listSort('post_event','ASC')" class="asc_sort sort_btn"></a></p>
																	<p><a href="javascript:void(0)" v-on:click="listSort('post_event','DESC')" class="desc_sort sort_btn"></a></p>
																</div>
															</span>
														</li>
														<li v-if="sortSelectData.listData[16].setting.show">
															<span>좋아요</span>
															<span class="sort_type_02">
																<div>
																	<p><a href="javascript:void(0)" v-on:click="listSort('like_event','ASC')" class="asc_sort sort_btn"></a></p>
																	<p><a href="javascript:void(0)" v-on:click="listSort('like_event','DESC')" class="desc_sort sort_btn"></a></p>
																</div>
															</span>
														</li>
														<li v-if="sortSelectData.listData[16].setting.show">
															<span>댓글</span>
															<span class="sort_type_02">
																<div>
																	<p><a href="javascript:void(0)" v-on:click="listSort('comment_event','ASC')" class="asc_sort sort_btn"></a></p>
																	<p><a href="javascript:void(0)" v-on:click="listSort('comment_event','DESC')" class="desc_sort sort_btn"></a></p>
																</div>
															</span>
														</li>
														<li v-if="sortSelectData.listData[16].setting.show">
															<span>공감</span>
															<span class="sort_type_02">
																<div>
																	<p><a href="javascript:void(0)" v-on:click="listSort('post_reaction_event','ASC')" class="asc_sort sort_btn"></a></p>
																	<p><a href="javascript:void(0)" v-on:click="listSort('post_reaction_event','DESC')" class="desc_sort sort_btn"></a></p>
																</div>
															</span>
														</li>
													</ul>
												</dd>
											</dl>
										</li>
									</ul>
								</div>
								<div class="table_body">
									<div class="table_body_inner" v-for="(item, index) in listData.data">
										<ul class="body_th clearfix">
											<input id="hidden-interest" type="text" :value="item.interest_list" ref="interest_copy">
											<li class="line-3" v-if="sortSelectData.listData[2].setting.show"><div class="line-inner">{{ item.report_date }}</div></li>
											<li class="line-4 normal_depth" v-if="sortSelectData.listData[3].setting.show"><div class="line-inner">{{ item.adset_name }}</div></li>
											<li class="line-5"><div class="line-inner"><template v-if="item.use_pickdata_target">O</template><template v-else>X</template></div></li><!-- 추가 -->
											<li class="line-6" v-if="sortSelectData.listData[4].setting.show"><div class="line-inner">{{ item.age }} 세</div></li>
											<li class="line-7" v-if="sortSelectData.listData[5].setting.show"><div class="line-inner">{{ item.gender }}</div></li>
											<li class="interest line-8" v-if="sortSelectData.listData[6].setting.show">
												<div class="line-inner">
													<span :class="'interest-sub-' + index" @click="tootip(index)">{{ item.interest_num }} 개</span>
													<div :id="'interest-sub-' + index" class="interest_view" v-if="item.interest_list.length != 0">
														<ul class="clearfix">
															<li v-for="elem in item.interest_list" >{{ elem }}</li>
														</ul>
														<div class="inter_clip_copy" v-on:click="clickCopy(index)">클립보드로 복사하기</div>
														<div class="inter_close" @click="tootip('close')">닫기</div>
													</div>
												</div>
											</li>
											<li class="line-9 normal_depth" v-if="sortSelectData.listData[7].setting.show"><div class="line-inner"><span v-for="ca in item.custom_audience">{{ ca }}</span></div></li>
											<li class="line-10 box-align" v-if="sortSelectData.listData[8].setting.show"><div class="line-inner">￦{{ numberFormat(item.spend) }}</div></li>
											<li class="line-11 box-align" v-if="sortSelectData.listData[9].setting.show"><div class="line-inner">{{ numberFormat(item.impressions) }}</div></li>
											<li class="line-12 box-align" v-if="sortSelectData.listData[10].setting.show"><div class="line-inner">{{ numberFormat(item.reach) }}</div></li>
											<li class="line-13 box-align" v-if="sortSelectData.listData[11].setting.show"><div class="line-inner">{{ numberFormat(item.frequency) }}</div></li>
											<li class="line-14 depth1" v-if="sortSelectData.listData[12].setting.show">
												<div class="line-inner">
													<dl>
														<dt></dt>
														<dd>
															<ul>
																<li>{{ numberFormat(item.inline_link_clicks) }}</li>
																<li>{{ item.inline_link_click_ctr }}</li>
																<li>￦{{ numberFormat(item.inline_link_click_cpc) }}</li>
															</ul>
														</dd>
													</dl>
												</div>
											</li>
											<li class="line-15 depth2" v-if="sortSelectData.listData[13].setting.show"><div class="line-inner">{{ checkCarousel(item.is_carousel) }}</div></li>
											<li class="line-16 depth3" v-if="sortSelectData.listData[14].setting.show">
												<div class="line-inner">
													<dl>
														<dt></dt>
														<dd>
															<ul>
																<li class="line-15">{{ numberFormat(item.video_view_event) }}</li>
																<li class="line-15">{{ checkObject(item.video_3_sec_watched_vtr) }}</li>
																<li class="line-15">￦{{ numberFormat(item.video_3_sec_watched_cpv) }}</li>
															</ul>
														</dd>
													</dl>
												</div>
											</li>

											<li class="line-17 depth4" v-if="sortSelectData.listData[15].setting.show">
												<div class="line-inner">
													<dl>
														<dt></dt>
														<dd>
															<ul>
																<li class="line-16">{{ numberFormat(item.pickdata_custom_conv_total) }}</li>
																<!-- cost_per_action_type?-->
																<li class="line-16">{{ item.pickdata_custom_conv_total_cost }}</li>
																<li class="line-16">{{ numberFormat(item.pickdata_custom_conv_first) }}</li>
																<li class="line-16">{{ numberFormat(item.pickdata_custom_conv_second) }}</li>
																<li class="line-16">{{ numberFormat(item.pickdata_custom_conv_third) }}</li>
																<li class="line-16">{{ numberFormat(item.pickdata_custom_conv_fourth) }}</li>
																<li class="line-16">{{ numberFormat(item.pickdata_custom_conv_fifth) }}</li>
															</ul>
														</dd>
													</dl>
												</div>
											</li>
											<li class="line-18 depth5" v-if="sortSelectData.listData[16].setting.show">
												<div class="line-inner">
													<dl>
														<dt></dt>
														<dd>
															<ul>
																<li class="line-17">{{ numberFormat(item.post_event) }}</li>
																<li class="line-17">{{ numberFormat(item.like_event) }}</li>
																<li class="line-17">{{ numberFormat(item.comment_event) }}</li>
																<li class="line-17">{{ numberFormat(item.post_reaction_event) }}</li>
															</ul>
														</dd>
													</dl>
												</div>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="partial-loading-box" v-if="loadShow">
						<div class="partial-widget">
							<ui-partial-loading></ui-partial-loading>
							<p class="loading-text">리스트를 불러오는 중입니다.<br/> 잠시만 기다려 주세요.<br/> {{ this.currentPage }} / {{ this.pageRange.pageNumber }} </p>
						</div>
					</div>

				</div>
				<!-- TODO Paging 처리 예정 -->
				<!-- <div class="pagination">
					<ul>
						<li v-show="currentPage > 1" v-on:click="clickFirstPage(firstPage)"><img src="../../assets/images/icon/paging_01.png" alt="" v-if="!loadShow"><img src="../../assets/images/icon/loading.gif" alt="로딩중" class="loading-img" v-if="loadShow" style="width:100%"></li>
						<li v-show="currentPage > 1" v-on:click="clickPreviousPage(currentPage)"><img src="../../assets/images/icon/paging_03.png" alt="" v-if="!loadShow"><img src="../../assets/images/icon/loading.gif" alt="로딩중" class="loading-img" v-if="loadShow" style="width:100%"></li>
						<li v-for="(n,index) in pageRange.pageNumber" v-if="(n >= pageRange.minPaging)&&(n <= pageRange.maxPaging)" v-on:click="clickPage(n)"
							v-bind:class="[currentPage === n ? 'now' : '']"><span v-if="!loadShow">{{ checkPageNumber(n) }}</span><img src="../../assets/images/icon/loading.gif" alt="로딩중" class="loading-img" v-if="loadShow" style="width:100%"></li>
						<li v-show="currentPage < pageRange.pageNumber" v-on:click="clickNextPage(currentPage)"><img src="../../assets/images/icon/paging_04.png" alt="" v-if="!loadShow"><img src="../../assets/images/icon/loading.gif" alt="로딩중" class="loading-img" v-if="loadShow" style="width:100%"></li>
						<li v-show="currentPage < pageRange.pageNumber" v-on:click="clickLastPage(pageRange.pageNumber)"><img src="../../assets/images/icon/paging_02.png" alt="" v-if="!loadShow"><img src="../../assets/images/icon/loading.gif" alt="로딩중" class="loading-img" v-if="loadShow" style="width:100%"></li>
					</ul>
				</div> -->
			</div>
		</div>
	</div>
</template>

<script>
// UI
import Select from '@/components/ui/Select'
import Calendar from '@/components/ui/Calendar'
import Loading from '@/components/ui/Loading'
import PartialLoading from '@/components/ui/PartialLoading'
import { numberToFixed, numberFormatter } from '@/components/utils/Formatter'

export default {
	name: 'TargetReport',

	components: {
		'ui-select': Select,
		'ui-calendar': Calendar,
		'ui-loading': Loading,
		'ui-partial-loading': PartialLoading
	},
	beforeMount () {
		this.setDatas()
	},

	mounted () {
		this.wResize()
		window.addEventListener('resize', this.wResize)
		this.sortTableAutoWidth()
		// this.getGridData()
	},

	beforeDestroy () {
		window.removeEventListener('resize', this.wResize)
	},

	created () {
		this.loadFbAdAccounts()
	},

	// mounted () {
	// 	this.loadFbAdAccounts()
	// },

	data () {
		return {
			loadShow:false,
			pageRange: {
				//페이지 번호
				pageNumber:1,
				//최소 페이징
				minPaging:0,
				//최대 페이징
				maxPaging:10,
				//노출 페이징 갯수
				showPaging:10,
				//현재 페이지
				nowPaging:1
			},
			moreGate:true,
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
			sortSelectData: {
				emptyText: '열 맞춤 설정',
				onShow:false,
				listData: [],
			},

			listData:{
				data: []
			},

			pageTotal: 0,
			currentPage: 1,
			firstPage: 1,

			tablesScrollLeft:0,
			tablesScrollTop:0,
			reSizeHeight:0,
			sMoveX:0,


			show: false,
			time: new Date(),
			range: [new Date(new Date().setDate(new Date().getDate() - 1)), new Date(new Date().setDate(new Date().getDate() - 1))],
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
			},

			isReport: true,
			isLoading: false,
			beforeSortType:'',
			loadingTitle: '',
			loadingDescription: ''
		}
	},
	methods: {
		wResize (){
			if(this.isReport == true) {
				const wSize = window.innerWidth - 185
				const hSize = window.innerHeight - 340
				const el = document.getElementById('report-widget')
				const listId = document.getElementById('report-list-inner')
				const listEl = listId.getElementsByClassName('contents_inner')
				el.style = "width:" + wSize + 'px'
				this.reSizeHeight = hSize;
			}
		},


		//리스트 스크롤 이벤트
		contentScroll() {
			const $El = document.getElementById("report-list-wrap")
			const $list1 = document.getElementById('report-list')
			const $head = $El.getElementsByClassName('table_default')
			const maxPage = this.pageRange.pageNumber
			let moveY = $El.scrollTop
			let moveX = $El.scrollLeft
			let scrollHeight = $El.scrollHeight
			let domHeight = $El.offsetHeight
			this.sMoveX = moveX

			if(0 <= moveY) {
				for(let i = 0; i < $head.length; i++) {
					$head[i].style.transform = "translateY(" + moveY +"px)"
				}
			}

			if(0 <= moveX) {
				$list1.style.transform = "translateX(" + moveX + "px)"
			}

			if(((domHeight + moveY) >= scrollHeight) && (this.moreGate == true) && (maxPage !== this.currentPage)) {
				this.listMore(this.pageRange.nowPaging)
				this.moreGate = false
			}

		},

		//스크롤 더보기
		listMore() {
			this.pageRange.nowPaging++
			this.moreEvent(this.pageRange.nowPaging)
		},

		//스크롤 더보기 리스트 추가
		moreEvent(n) {
			if(this.currentPage !== n) {
				this.currentPage = n
				this.getGridData('scroll')
			}else{
				return false
			}
		},

		tootip (index) {
			const tools = document.getElementsByClassName('interest_view')
			const subId = event.target.className
			const subEl = document.getElementById(subId)
			for(let i = 0; i < tools.length; i++) {
				tools[i].style = "display:none"
			}
			if (subEl !== null) {
				if(index != 'close') {
					if(subEl.style.display == 'block') {
						subEl.style = "display:none"
					}else{
						subEl.style = "display:block"
					}
				}
			}
		},

		setDatas () {

			const label = ['광고주','캠페인명','기간','광고세트','연령','성별','관심사 개수','맞춤타겟 이름','광고비','노출','도달','도달빈도','사이트 유입 지표','슬라이드 소재 클릭 지표','영상캠페인 지표','전환 지표','페이지 참여 지표']
			const sortData = []

			for(let i = 0; i < label.length; i++) {
				let setting = {
					setting:{
						name:label[i],
						checkId:'sort' + i,
						show:true,
						checked:true
					}
				}
				this.sortSelectData.listData.push(setting)
			}
		},

		selectCategory (item) {
			this.categorySelectData.emptyText = item
			this.loadFbAdAccounts()
		},

		selectAccount (item) {
			this.accountSelectData.emptyText = item
		},

		sortSelectOnOff () {
			this.sortSelectData.onShow = !this.sortSelectData.onShow
		},

		sortSelectFilter (item) {
			const me = this
			item.setting.checked = !item.setting.checked
			item.setting.show = !item.setting.show
			setTimeout(function() {
				me.sortTableAutoWidth()
			}, 1)
		},

		sortTableAutoWidth (){
			const listEl = document.getElementById('report-list-inner')
			const repEl1 = document.getElementById('report-list')
			const repEl2 = document.getElementById('report-list-2')
			const defaultEl = repEl1.getElementsByClassName('report-line')
			const liEl = listEl.getElementsByClassName('report-line')
			const fors = [defaultEl,liEl]
			let listWidth = 0
			let listWidth2 = 0

			for(let idx = 0; idx < fors.length; idx++) {
				for(let i = 0; i < fors[idx].length; i++) {
					if(idx == 0) {
						listWidth += fors[idx][i].offsetWidth
					}else{
						listWidth2 += fors[idx][i].offsetWidth
					}
				}
			}

			repEl2.style.paddingLeft = listWidth + 'px'
			repEl2.style.width = listWidth2 + 'px'
			repEl2.style.paddingLeft = listWidth + 'px'
		},


		listSort(key, type) {
			const item = this.listData.data
			//숫자 형식 소팅(String,Text 형식 지원 X)
			const byNum = item.slice(0)
			const me = this
			const $el = event.target
			const $btns = document.querySelectorAll('.sort_btn')
			const onCheck = event.target.classList.contains('on')
			const beforeType = this.beforeType

			if(beforeType !== type || onCheck === false) {
				byNum.sort(function(a,b) {
					if(type == 'ASC') {
							return me.checkObject(parseFloat(a[key])) - me.checkObject(parseFloat(b[key]))
					}else{
							return me.checkObject(parseFloat(b[key])) - me.checkObject(parseFloat(a[key]))
					}
				})
			}
			this.beforeType = type
			this.listData.data = byNum
			//sort arrow element class Add and Remove Actions
			for (var i = 0; i < $btns.length; i++) {
			   $btns[i].classList.remove('on')
			}
			$el.classList.add('on')
		},

		disabledDate (time) {
			return time < this.min || time > this.max
		},
		dc (e) {
			this.show = this.$el.contains(e.target) && !this.disabled
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
			*/
			const emptyText = this[selectName].emptyText
			const textList = this[selectName].textList
			const keyList = this[selectName].keyList
			return keyList[textList.indexOf(emptyText)]
		},


		//페이징관련 (start)(현재 사용하지않음)
		getPageNumber () {
			var limit = 25
			var page_total = this.pageTotal
			var page_number = page_total / limit
			this.pageRange.pageNumber = Math.ceil(page_number)
		},
		clickPage (n) {
			if(this.currentPage !== n) {
				this.currentPage = n
				this.getGridData('paging')
			}else{
				return false
			}
		},
		clickFirstPage (n) {
			this.currentPage = n
			this.pageRange.minPaging = 1
			this.pageRange.maxPaging = 10
			this.getGridData('paging')
		},
		clickLastPage(n) {
			const nString = String(n)
			const nlength = nString.length
			const nLast = nString.substring(nlength - 1)
			const nCal = n - Number(nLast)

			this.currentPage = n
			this.pageRange.minPaging = nCal + 1
			this.pageRange.maxPaging = n

			this.getGridData('paging')
		},

		checkPageNumber (n) {
			return n
		},

		clickNextPage (p) {
			this.currentPage = p + 1
			// const pageRange = Array.from({length: this.pageNumber}, (v, k) => k+1)
			if(this.pageRange.maxPaging < this.currentPage) {
				this.pageRange.minPaging = this.currentPage
				this.pageRange.maxPaging = this.pageRange.minPaging + this.pageRange.showPaging - 1
				if(this.pageRange.maxPaging > this.pageRange.pageNumber) {
					this.pageRange.maxPaging = this.pageRange.pageNumber
				}
			}
			this.getGridData('paging')
		},

		clickPreviousPage (p) {
			this.currentPage = p - 1
			if(this.pageRange.minPaging > this.currentPage) {
				if(this.currentPage < this.pageRange.showPaging + 1) {
					this.pageRange.minPaging = this.pageRange.minPaging - this.pageRange.showPaging - 1
					this.pageRange.maxPaging = this.pageRange.minPaging + this.pageRange.showPaging
				}else{
					this.pageRange.minPaging = this.pageRange.minPaging - this.pageRange.showPaging
					this.pageRange.maxPaging = this.pageRange.minPaging + this.pageRange.showPaging - 1
				}
			}
			this.getGridData('paging')
		},
		//페이징 관련 (end)

		getGridData (type) {
			var date_range = []
			this.range.forEach(date => {
				date_range.push(date.toISOString().split('T')[0])
			})

			if(type !== 'scroll') {
				this.listData.data = []
				//스크롤 더보기 재가동 및 초기화
				this.pageRange.nowPaging = 1
				this.currentPage = 1
				this.moreGate = true
			}

			if(type == 'paging') {
				this.loadShow = true
			}else if(type == 'scroll'){
				this.loadShow = true
			} else{
				this.currentPage = 1
				this.isReport = false
				this.loadShow = false
				this.isLoading = true
				this.loadingTitle = '인사이트를 가져오는 중입니다.'
				this.loadingDescription = '조금만 기다려 주시면, 인사이트를 가져옵니다.'
			}

			let url = '/ad_set_insights/'
			this.$http.get(url, {
				params: {
					account_id: this.findSelectKey('accountSelectData'),
					category_name: this.findSelectKey('categorySelectData'),
					since: date_range[0],
					until: date_range[1],
					page: this.currentPage
				}
			})
			.then(res => {
				const response = res.data
				const data = response.data
				const total = response.total_count
				const success = response.success
				if (success === "YES") {
					data.forEach(item => {
						this.listData.data.push(item)
					})
					this.pageTotal = total
					this.getPageNumber()
					this.isReport = true
					this.isLoading = false
					this.loadShow = false
					this.moreGate = true
				} else {
					throw('success: ' + success)
					this.isReport = true
					this.isLoading = false
					this.loadShow = false
					this.moreGate = true
				}
			})
			.catch(err => {
				this.isLoading = false
				this.loadShow = false
				this.moreGate = true
				console.error('/ad_set_insights', err)
			})
		},

		// getCustomMappingEvent (item, type) {
		// 	const pixel_event = item.pickdata_custom_pixel_event
		// 	let value = 0
		// 	pixel_event.forEach(elem => {
		// 		const name = elem.custom_name
		// 		if (name == type) {
		// 			value = elem.value
		// 			if (type == '전환완료') {
		// 				this.convTotal = elem.value
		// 			} else if (type == '전환완료가치') {
		// 				value = (this.convTotal / item.spend).toFixed(2)
		// 				this.convResultWorth = value
		// 			} else if (type == '전환 1단계') {
		// 				this.convValues.convResult1 = elem.value
		// 			} else if (type == '전환 2단계') {
		// 				this.convValues.convResult2 = elem.value
		// 			} else if (type == '전환 3단계') {
		// 				this.convValues.convResult3 = elem.value
		// 			} else if (type == '전환 4단계') {
		// 				this.convValues.convResult4 = elem.value
		// 			} else if (type == '전환 5단계') {
		// 				this.convValues.convResult5 = elem.value
		// 			} else {
		// 				// pass
		// 			}
		// 		}
		// 		else {
		// 			// return 0
		// 		}
		// 	})
		// 	// this.convValues.push(value)
		// 	return value
		// },

		downloadReport () {
			console.log('download')
			var date_range = []
			this.range.forEach(date => {
				date_range.push(date.toISOString().split('T')[0])
			})
			const account_id = this.findSelectKey('accountSelectData')
			const category_name = this.findSelectKey('categorySelectData')
			const since = date_range[0]
			const until = date_range[1]

			// ad_set_insights/?account_id=349408409&since=2018-01-01&until=2018-01-15
			let url = '/ad_set_insights/download?account_id=' + account_id + '&category_name=' + category_name + '&since=' + since + '&until=' + until
			window.open(url, '_blank')
		},

		numberFormat (n) {
			if (typeof n === typeof undefined || n == null) {
				return 0
			}
			return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		},

		checkObject (n) {
			if (typeof n === typeof undefined || n == null) {
				return 0
			} else {
				return n
			}
		},

		clickCopy (index) {
			var result
			this.$refs.interest_copy[index].select();
			result = document.execCommand('copy')
			return result
		},

		checkCarousel (carousel) {
			if (carousel === true) {
				return '사용'
			} else {
				return '-'
			}
		}
	}
}
</script>

<style lang="css" scoped>
html { overflow:hidden; }
.Spinner { margin:0 auto 10px !important; }
.partial-loading-box { float:left; position:absolute; left:0; top:0; width:100%; height:100%; z-index:10; margin:0; background:rgba(255,255,255,0.8); }
.partial-widget { position:relative; top:50%; transform:translateY(-50%); }
.loading-text { text-align:center; color:#000; }
#hidden-interest { float:left; height:0; }
</style>
