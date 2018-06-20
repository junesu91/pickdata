<template>
	<div>
		<div class="select_contents" tabindex="-1" @blur="hide">
			<div class="select" v-on:click="onShow">
				<p v-bind:class="this.pArrowUp">{{ selectData.emptyText }}
					<span class="text-span" v-if="pixelIdShow">{{ selectData.emptyTextId }}</span>
				</p>
			</div>
			<ul class="select_view" :style="this.selectViewStyle">
				<li v-for="(item, index) in selectData.textList" :key="index" @click="onClick(item)" v-on:click="onShow">{{ item }}
					<span class="text-span" v-if="pixelIdShow">{{ selectData.pixelId[index] }}</span>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
export default {
  data () {
    return {
      selectViewStyle: {
        display: 'none'
      },
      pArrowUp: ''
    }
  },

  watch: {
    'selectData.emptyText': function(selectedItem, unselectedItem) {
      // 선택한 항목 셀렉트 박스에서 제외
      this.$emit('exceptSelectedItems', selectedItem, unselectedItem)
    }
  },

  props: {
    selectData: {
      type: Object,
      default () {
        return {
          emptyText: '2018',
		  emptyTextId:'',
		  textList: [
		  	1
		  ],
		  pixelId:[]
        }
      }
    },
    //광고설정 영역 픽셀 아이디값 온오프
    pixelIdShow:{
      type:Boolean,
      default() {
        return false
      }
    },
    onClick: {
      type: Function,
      required: false,
      default: function (item) {
      console.log('default', item)
      }
    }
  },
  methods: {
    onShow: function () {
      if (this.selectViewStyle.display === 'none') {
        this.pArrowUp = 'arrow_up'
        this.selectViewStyle.display = 'block'
      } else {
        this.pArrowUp = ''
        this.selectViewStyle.display = 'none'
      }
    },
    hide:function() {
      this.pArrowUp = ''
      this.selectViewStyle.display = 'none'
    }
  }
}
</script>

<style lang="scss" scoped>
// p{background:url(assets/images/icon/target_down.png) center right no-repeat; margin-right:10px;}
// p.arrow_up{background:url(assets/images/icon/target_up.png) center right no-repeat;}
</style>
