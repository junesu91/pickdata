<template>
	<div id="main_wrap">
		<div id="container">
			<div id="container_wrap">
				<div class="list-tab-widget">
					<div id="report-widget" class="tab-contents-widget">
						<div id="section_list_2" class="section_tab_contents clearfix">
							<div class="target_aside">
								<ul id="target_aside_ul">
									<li><router-link v-bind:to="{ name: 'AccountReport' }">광고계정 Report</router-link></li>
									<li><router-link v-bind:to="{ name: 'SetReport' }">광고세트 Report</router-link></li>
								</ul>
								<!-- <nav id="navigation">
									<ul class="nav-ul">
										<li v-for="(menu, index) in menus">
											<a href="javascript:void(0);" @click="menuAction(index)"><strong>{{ menu.name }}</strong></a>
											<ul class="nav-sub" v-show="isMenu == index">
												<li v-for="(subMenu, index) in menu.sub"><router-link v-bind:to="{ path: subMenu.link }" :class="[(isSub == index) ? 'on' : '']">- {{ subMenu.name }}</router-link></li>
											</ul>
										</li>
									</ul>
								</nav> -->
							</div>
							<router-view/>
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
	// data() {
 //        return {
 //            isSub: '/report/accountreport',
 //            isMenu: 0,
 //            menus: [{
 //                name: '123',
 //                link: '/report/accountreport',
 //                sub: [{
 //                    name: '123',
 //                    link: '/report/accountreport'
 //                }]
 //            }, {
 //                name: '456',
 //                link: '/report/setreport',
 //                sub: [{
 //                    name: '456',
 //                    link: '/report/setreport'
 //                }]
 //            }]
 //        }
 //    },
    methods: {
        // menuAction(index) {
        //     if (this.isMenu !== index) {
        //         this.isMenu = index;
        //     } else {
        //         this.isMenu = -1;
        //     }
        // },
        // onAction() {
        //     const path = location.hash
        //     const menu = path.split('/')[1]
        //     this.isMenu = (menu.indexOf('report') <= -1) ? 0 : 1
        //     this.isSub = path

        // }
    }
	// created () {
	// 	this.$router.push({ path: 'report/accountreport' })
	// }
}
</script>

<style lang="scss" scoped>
// .target_aside {
// 	ul{
// 		li{margin-bottom:64px;}
// 	}
// }
</style>
