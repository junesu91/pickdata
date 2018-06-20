<template>
  <div class="target_contents_wrap clearfix" v-if="isShow">
    <transition name="modal">
      <ui-dialog :dialogData="dialogData" v-if='dialogShow' @ok='dialogOk' @cancel="dialogCancel"></ui-dialog>
    </transition>
    <div class="target_contents_inner">
      <div class="target_thead">
        <div class="main_title">
          <div><img src="../../../assets/images/target/target_logo_04.png" alt="neo"></div>
          <div class="title_info">
            <p>구글애널리틱스</p>
            <p>타겟의 속성을 정의하세요</p>
          </div>
        </div>
        <div class="use_wrap">
          <div class="use_select">
            <div class="contents_title">사용 픽셀</div>
            <ui-select :selectData="adAccountPixels" data-key="adAccountPixels" :onClick="selectOnClick"></ui-select>
          </div>
          <div class="use_date">
            <div>수집 기간 : 최근</div>
            <div><input type="text" v-model="collectionPeriod"><span>일</span></div>
          </div>
        </div>
        <div class="target_name">
          <div class="contents_title">타겟 이름</div>
          <div><input type="text" v-model="targetName"></div>
        </div>
        <div class="target_data">
          <div class="contents_title">타겟 모수</div>
          <div>
            <span>{{ this.audienceSize }}</span>
            <span v-show="isNumber">명</span>
          </div>
        </div>
      </div>
      <div class="target_tbody">
        <div class="account_widget">
          <div class="account_info_wrap">
            <div class="account_info">
              <div class="account_title">"아래 UTM 속성으로 유입된 사람" 중</div>
              <div>
                <div class="select_btn">
                  <div class="select_contents">
                    <ui-select :selectData="this.selectCustomer" data-key="selectCustomer" :onClick="selectOnClick"></ui-select>
                  </div>
                </div>
              </div>
              <div class="account_date" v-if="subSelect">
                <ui-select :selectData="this.selectSub" data-key="selectSub" :onClick="selectOnClick"></ui-select>
              </div>
              <div class="account_date" v-if="subInput">
                <input type="text" v-if="subInput" v-model="unvisitedPeriod"><span>일</span>
              </div>
            </div>
          </div>
          <div class="terms_wrap">
            <button type="button" v-if="terms_add === false" @click="click_terms_add()">+ 조건추가</button>
            <button type="button" v-if="terms_delete === false" @click="click_terms_delete()">- 조건제외</button>
          </div>
          <!-- 조건 추가 경우 -->
          <!-- v1.2 추가내용 시작 (화면수정 - 조건 추가) -->
          <div class="account_info add_info" v-if="terms_add">
            <div class="account_title">중</div>
            <div>
              <ui-select :selectData="addSelectCustomer" data-key="addSelectCustomer" :onClick="selectOnClick"></ui-select>
            </div>
            <div class="account_date" v-if="addSubSelect">
              <ui-select :selectData="addSelectSub" data-key="addSelectSub" :onClick="selectOnClick"></ui-select>
            </div>
            <div class="account_date" v-if="addSubInput">
              <input type="text" v-if="addSubInput" v-model="addUnvisitedPeriod" onkeyup="this.value=this.value.replace(/[^0-9]/g, '')"><span>일</span>
            </div>
            <div class="terms_wrap">
              <button class="terms_add_btn" type="button" @click="terms_add_reset()">삭제</button>
            </div>
          </div>
          <!-- v1.2 추가내용 끝 (화면수정 - 조건 추가) -->
          <!-- // 조건 추가 경우 -->
          <!-- 조건 제외 경우 -->
          <!-- v1.2 추가내용 시작 (화면수정 - 조건 제외) -->
          <div class="account_info add_info" v-if="terms_delete">
            <div class="account_title">에서</div>
            <div>
              <ui-select :selectData="removeSelectCustomer" data-key="removeSelectCustomer" :onClick="selectOnClick"></ui-select>
            </div>
            <div class="account_date" v-if="removeSubSelect">
              <ui-select :selectData="removeSelectSub" data-key="removeSelectSub" :onClick="selectOnClick"></ui-select>
            </div>
            <div class="account_date" v-if="removeSubInput">
              <input type="text" v-if="removeSubInput" v-model="removeUnvisitedPeriod" onkeyup="this.value=this.value.replace(/[^0-9]/g, '')"><span>일</span>
            </div>
            <div>
              <span class="except_title">제외</span>
            </div>
            <div class="terms_wrap">
              <button class="terms_add_btn" type="button" @click="terms_delete_reset()">삭제</button>
            </div>
          </div>
          <!-- v1.2 추가내용 끝 (화면수정 - 조건 추가) -->
          <!-- // 조건 제외 경우 -->
        </div>
        <div class="target_inner_tbody google_body clearfix">
          <div class="target_generate google_analytics">
            <div class="generate_url_list">
              <form id="google_url_form" class="url_list clearfix" v-on:submit.prevent="addAnalyData">
                <div class="url_select clearfix">
                  <div class="select_btn">
                    <div class="select_contents">
                      <ui-select id="utm_key" :selectData="this.selectUtmType" data-key="selectUtmType" :onClick="selectOnClick"></ui-select>
                    </div>
                  </div>
                </div>
                <div class="url_input">
                  <input id="utm_name" type="text" v-model="inputUtmName" autocomplete="off" placeholder="값 입력 후 엔터를 치면 아래에 입력됩니다.">
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="analytics_tab_wrap">
          <div class="analytics_tab_widget clearfix">
            <ul class="clearfix">
              <li @click="wTabs(0,'wTab')" v-bind:class="[(wTab.tab1 === true) ? 'active' : '']">source</li>
              <li @click="wTabs(1,'wTab')" v-bind:class="[(wTab.tab2 === true) ? 'active' : '']">medium</li>
              <li @click="wTabs(2,'wTab')" v-bind:class="[(wTab.tab3 === true) ? 'active' : '']">campaign</li>
              <li @click="wTabs(3,'wTab')" v-bind:class="[(wTab.tab4 === true) ? 'active' : '']">term</li>
              <li @click="wTabs(4,'wTab')" v-bind:class="[(wTab.tab5 === true) ? 'active' : '']">content</li>
              <li @click="wTabs(5,'wTab')" v-bind:class="[(wTab.tab6 === true) ? 'active' : '']">custom</li>
            </ul>
          </div>
          <div class="analytics_tab_list">
            <!-- UTM Source -->
            <div id="tab_list_1" class="analytics_tab_contents clearfix" v-if="wTab.tab1">
              <ul>
                <li v-for="(item, index) in gAddData.utm_source" :key="index" class="sticker_btn">
                  <span>{{ item.name }}</span>
                  <span class="close-btn" @click="deleteAnalyData(item, 'utm_source')">
                    <img src="../../../assets/images/target/target_list_close.png" alt="">
                  </span>
                </li>
              </ul>
              <div class="list_close_btn">
                <button type="button" @click="deleteAnalyData('all', 'utm_source')">
                  <img src="../../../assets/images/target/target_close_btn.png" alt="">
                </button>
              </div>

            <!-- UTM Medium -->
            </div>
            <div id="tab_list_2" class="analytics_tab_contents clearfix" v-if="wTab.tab2">
              <ul>
                <li v-for="(item, index) in gAddData.utm_medium" :key="index" class="sticker_btn">
                  <span>{{ item.name }}</span>
                  <span class="close-btn" @click="deleteAnalyData(item, 'utm_medium')">
                    <img src="../../../assets/images/target/target_list_close.png" alt="">
                  </span>
                </li>
              </ul>
              <div class="list_close_btn">
                <button type="button" @click="deleteAnalyData('all', 'utm_meidum')">
                  <img src="../../../assets/images/target/target_close_btn.png" alt="">
                </button>
              </div>

            <!-- UTM Campaign -->
            </div>
            <div id="tab_list_3" class="analytics_tab_contents clearfix" v-if="wTab.tab3">
              <ul>
                <li v-for="(item, index) in gAddData.utm_campaign" :key="index" class="sticker_btn">
                  <span>{{ item.name }}</span>
                  <span class="close-btn" @click="deleteAnalyData(item, 'utm_campaign')">
                    <img src="../../../assets/images/target/target_list_close.png" alt="">
                  </span>
                </li>
              </ul>
              <div class="list_close_btn">
                <button type="button" @click="deleteAnalyData('all', 'utm_campaign')">
                  <img src="../../../assets/images/target/target_close_btn.png" alt="">
                </button>
              </div>
            </div>

            <!-- UTM Term -->
            <div id="tab_list_4" class="analytics_tab_contents clearfix" v-if="wTab.tab4">
              <ul>
                <li v-for="(item, index) in gAddData.utm_term" :key="index" class="sticker_btn">
                  <span>{{ item.name }}</span>
                  <span class="close-btn" @click="deleteAnalyData(item, 'utm_term')">
                    <img src="../../../assets/images/target/target_list_close.png" alt="">
                  </span>
                </li>
              </ul>
              <div class="list_close_btn">
                <button type="button" @click="deleteAnalyData('all', 'utm_term')">
                  <img src="../../../assets/images/target/target_close_btn.png" alt="">
                </button>
              </div>
            </div>

            <!-- UTM Content -->
            <div id="tab_list_5" class="analytics_tab_contents clearfix" v-if="wTab.tab5">
              <ul>
                <li v-for="(item, index) in gAddData.utm_content" :key="index" class="sticker_btn">
                  <span>{{ item.name }}</span>
                  <span class="close-btn" @click="deleteAnalyData(item, 'utm_content')">
                    <img src="../../../assets/images/target/target_list_close.png" alt="">
                  </span>
                </li>
              </ul>
              <div class="list_close_btn">
                <button type="button" @click="deleteAnalyData('all', 'utm_content')">
                  <img src="../../../assets/images/target/target_close_btn.png" alt="">
                </button>
              </div>
            </div>

            <!-- UTM Custom -->
            <div id="tab_list_6" class="analytics_tab_contents clearfix" v-if="wTab.tab6">
              <ul>
                <li v-for="(item, index) in gAddData.custom" :key="index" class="sticker_btn">
                  <span>{{ item.name }}</span>
                  <span class="close-btn" @click="deleteAnalyData(item, 'custom')">
                    <img src="../../../assets/images/target/target_list_close.png" alt="">
                  </span>
                </li>
              </ul>
              <div class="list_close_btn">
                <button type="button" @click="deleteAnalyData('all', 'custom')">
                  <img src="../../../assets/images/target/target_close_btn.png" alt="">
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="makeType === 'modify'" class="modify_prologue">* 설정 수정시 기존 생성된 타겟과 병합되어 모수가 중복될 수 있습니다. 특별한 상황이 아니면 설정의 수정을 지양해주세요.</div>
        <div class="btn_wrap">
          <button class="before_btn close_pop" @click="clickCancel()">취소</button>
          <button class="next_btn" @click="createUtmTarget()" v-if="makeType == 'add'">타겟 만들기</button>
          <button class="delete_btn" @click="deleteUtmTarget()" v-if="makeType == 'modify'">삭제</button>
          <button class="next_btn" @click="updateUtmTarget()" v-if="makeType == 'modify'">타겟 수정하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { numberFormatter } from '@/components/utils/Formatter'
import Select from '@/components/ui/Select'
import Dialog from '@/components/ui/Dialog'

export default {
  name: 'UtmTarget',

  components: {
    'ui-select': Select,
    'ui-dialog': Dialog
  },

  props: {
    isShow: {
      type: Boolean,
      default () {
        return false
      }
    },

    adAccountPixels: {
      type: Object,
      default () {
        return {
          emptyText: '불러오는 중 입니다.',
          textList: [
            '불러오는 중 입니다.'
          ]
        }
      }
    },

    tabMove: {
      type: Function
    },

    makeType: {
      type:String
    },

    makeItem: {
      type: Object
    }
  },

  created () {
    this.$eventBus.$on('modifyUtmTarget', this.modifyUtmTarget)
  },

  beforeDestroy () {
    this.$eventBus.$off('modifyUtmTarget', this.modifyUtmTarget)
  },

  data () {
    return {
      collectionPeriod: 30,
      unvisitedPeriod: 0,
      targetName: '',
      inputUtmName: '',
      audienceSize: '-',
      isNumber: false,

      subSelect: false,
      subInput: false,

      gAddData: {
        utm_source: [],
        utm_medium: [],
        utm_campaign: [],
        utm_term: [],
        utm_content: [],
        custom: []
      },

      dialogShow: false,
      dialogData: {
        emptyText:'sample',
        type:'confirm',
        mode:'sample'
      },
      nextStage: false,

      selectCustomer: this.$store.state.defaultDetails,
      selectSub: {
        emptyText: '5%',
        textList: [
          '5%',
          '15%',
          '25%'
        ],
        keyList: [
          '5',
          '15',
          '25'
        ]
      },
      selectUtmType: {
        emptyText: 'utm_source',
        textList: [
          'utm_source',
          'utm_medium',
          'utm_campaign',
          'utm_term',
          'utm_content',
          'custom'
        ]
      },
      wTab: {
        tab1: true,
        tab2: false,
        tab3: false,
        tab4: false,
        tab5: false,
        tab6: false
      },
      terms_add : false,
      terms_delete : false,

      // v1.2 추가내용 시작 (신규 필요 데이터)
      addSelectCustomer: {
        textList: [
        ],
        keyList: [
        ]
      },

      addSelectSub: {
        emptyText: '5%',
        textList: [ '5%', '15%', '25%' ],
        keyList: [ '5', '15', '25' ]
      },
      addUnvisitedPeriod: 0,
      addSubSelect: false,
      addSubInput: false,

      removeSelectCustomer: {
        textList: [
        ],
        keyList: [
        ]
      },

      removeSelectSub: {
        emptyText: '5%',
        textList: [ '5%', '15%', '25%' ],
        keyList: [ '5', '15', '25' ]
      },
      removeUnvisitedPeriod: 0,
      removeSubSelect: false,
      removeSubInput: false
      // v1.2 추가내용 끝 (신규 필요 데이터)
    }
  },

  watch: {
    collectionPeriod (day) {
      if (day > 180) {
        this.dialogOpen('수집 기간은 최대 180일까지만 가능합니다.', 'alert')
        this.collectionPeriod = 180
      } else if (this.collectionPeriod === '0') {
        this.dialogOpen('수집 기간은 최소 1일입니다.', 'alert')
        this.collectionPeriod = 1
      }
    },

    unvisitedPeriod (day) {
      if(day >= this.collectionPeriod) {
        this.dialogOpen('미방문 기간은 수집 기간보다 작아야합니다.', 'alert')
        this.unvisitedPeriod = this.collectionPeriod - 1
      }
    },

    // v1.2 추가내용 시작 (신규 셀렉트 박스 밸리데이션)
    addUnvisitedPeriod (day) {
      if(day >= this.collectionPeriod) {
        alert('미방문 기간은 수집 기간보다 작아야합니다.')
        this.addUnvisitedPeriod = this.collectionPeriod - 1
      }
    },

    removeUnvisitedPeriod (day) {
      if(day >= this.collectionPeriod) {
        alert('미방문 기간은 수집 기간보다 작아야합니다.')
        this.removeUnvisitedPeriod = this.collectionPeriod - 1
      }
    },
    // v1.2 추가내용 끝 (신규 셀렉트 박스 밸리데이션)

    targetName (name) {
      if (name.length > 48) {
        this.dialogOpen('타겟 이름은 최대 48자까지만 가능합니다.', 'alert')
        this.targetName = name.substr(0,48)
      }
    }
  },

  methods: {
    // v1.2 추가내용 시작 (파라메터 생성 Function)
    makeInclusions () {
      let inclusions = []
      let defaultDetails = {
        detail: this.findSelectKey('selectCustomer'),
        exclusion_retention_days: parseInt(this.unvisitedPeriod),
        input_percent: parseInt(this.findSelectKey('selectSub'))
      }
      let addDetails = {
        detail: this.findSelectKey('addSelectCustomer'),
        exclusion_retention_days: parseInt(this.addUnvisitedPeriod),
        input_percent: parseInt(this.findSelectKey('addSelectSub'))
      }

      inclusions.push(defaultDetails)
      if (this.terms_add) {
        inclusions.push(addDetails)
      }
      return inclusions
    },

    makeExclusions () {
      let exclusions = []
      let removeDetails = {
        detail: this.findSelectKey('removeSelectCustomer'),
        exclusion_retention_days: parseInt(this.removeUnvisitedPeriod),
        input_percent: parseInt(this.findSelectKey('removeSelectSub'))
      }
      if (this.terms_delete) {
        exclusions.push(removeDetails)
      }
      return exclusions
    },
    // v1.2 추가내용 끝 (파라메터 생성 Function)

    dialogOpen (emptyText, type, mode) {
      this.dialogData['emptyText'] = emptyText
      this.dialogData['type'] = type
      this.dialogData['mode'] = mode
      this.dialogShow = true
    },

    click_terms_add() {
      this.terms_add = true
      this.addSelectCustomer = {
        textList: [],keyList: []
      }

      for(let i = 0; i < this.selectCustomer.keyList.length; i++) {
         let check_result = true
         if (this.selectCustomer.textList[i] == '전체 고객'){
           check_result = false
         }
         if (this.terms_delete == true && this.removeSelectCustomer.emptyText == this.selectCustomer.textList[i]){
           check_result = false
         }
         if (this.selectCustomer.textList[i] == this.selectCustomer.emptyText ) {
           check_result = false
         }

         if(check_result == true){
           this.addSelectCustomer.keyList.push(this.selectCustomer.keyList[i])
           this.addSelectCustomer.textList.push(this.selectCustomer.textList[i])
         }
      }

      if(this.addSelectCustomer.keyList.length > 0){
        this.addSubSelect = false
        this.addSubInput = false
        const textCheck = this.addSelectCustomer.textList[0]

        if (textCheck.replace(/\s/gi, "") === '이용시간상위고객') {
          this.addSubSelect = true
        } else if(textCheck.replace(/\s/gi, "") === '특정일동안미방문고객') {
          this.addSubInput = true
        }

        this.addSelectCustomer.emptyText = textCheck
      }else{
        this.terms_add = false
        alert("더 이상 조건을 추가할 수 없습니다.")
      }

    },

    click_terms_delete() {
      this.terms_delete = true
      this.removeSelectCustomer = {
        textList: [],keyList: []
      }

      for(let i = 0; i < this.selectCustomer.keyList.length; i++) {
         let check_result = true
         if (this.selectCustomer.textList[i] == '전체 고객'){
           check_result = false
         }

         if (this.selectCustomer.textList[i] == '특정일 동안 미방문 고객' || this.selectCustomer.textList[i] == '미 구매고객' || this.selectCustomer.textList[i] == '미 전환 고객'){
           check_result = false
         }

         if (this.terms_add == true && this.addSelectCustomer.emptyText == this.selectCustomer.textList[i]){
           check_result = false
         }
         if (this.selectCustomer.textList[i] == this.selectCustomer.emptyText ) {
           check_result = false
         }

         if(check_result == true){
           this.removeSelectCustomer.keyList.push(this.selectCustomer.keyList[i])
           this.removeSelectCustomer.textList.push(this.selectCustomer.textList[i])
         }
      }

      if (this.removeSelectCustomer.keyList.length> 0){
        this.removeSubSelect = false
        this.removeSubInput = false
        const textCheck = this.removeSelectCustomer.textList[0]

        if (textCheck.replace(/\s/gi, "") === '이용시간상위고객') {
          this.removeSubSelect = true
        } else if(textCheck.replace(/\s/gi, "") === '특정일동안미방문고객') {
          this.removeSubInput = true
        }
        this.removeSelectCustomer.emptyText = textCheck
      }else{
        this.terms_delete = false
        alert("더 이상 조건을 추가할 수 없습니다.")
      }
    },

    clickCancel() {
      this.terms_reset()
      this.terms_add_reset()
      this.terms_delete_reset()
      this.makeType === 'modify' ? $emit('close') : this.tabMove(0)
    },

    // 다이얼로그 확인 클릭시
    dialogOk () {
      const mode = this.dialogData.mode

      if (mode === 'createUtmTarget') {
        // Create Target ————————————————————————————————
        let params = {
          fb_ad_account_id: localStorage.getItem('fb_ad_account_id'),
          target_type: 'utm_target',
          pixel_id: this.findSelectKey('adAccountPixels'),
          name: this.targetName,
          retention_days: this.collectionPeriod,
          exclusion_retention_days: this.unvisitedPeriod,

          detail: this.findSelectKey('selectCustomer'),
          input_percent: this.findSelectKey('selectSub'),

          sources: this.convertUtmName(this.gAddData.utm_source),
          mediums: this.convertUtmName(this.gAddData.utm_medium),
          campaigns: this.convertUtmName(this.gAddData.utm_campaign),
          terms: this.convertUtmName(this.gAddData.utm_term),
          contents: this.convertUtmName(this.gAddData.utm_content),
          customs: this.convertUtmName(this.gAddData.custom),
          inclusions: this.makeInclusions(),
          exclusions: this.makeExclusions()
        }

        this.$http.post('/pickdata_account_target/custom_target', params)
        .then((response) => {
          var success = response.data.success
          if (success == "YES") {
            // success
            this.$eventBus.$emit('getAccountTarget')
          } else {
            //컨펌,얼럿 텍스트 - 메세지창 타입(confirm,alert) - 독립적모드이름(alert 메세지시 사용 X)
            this.dialogOpen('구글애널리틱스 타겟 생성 실패', 'alert')
            throw('success: ' + success)
          }
          this.$emit('close')
        })
        .catch(err => {
          this.$emit('close')
          console.log('/pickdata_account_target/custom_target: ', err)
        })
      } else if (mode === 'deleteUtmTarget') {
        // Delete Target ————————————————————————————————
        this.$emit('deleteCustomTarget', this.makeItem.id)

      } else if (mode === 'updateUtmTarget') {
        // Update Target ————————————————————————————————
        let params = {
          pickdata_account_target_id: this.makeItem.id,
          fb_ad_account_id: localStorage.getItem('fb_ad_account_id'),
          target_type: 'utm_target',
          pixel_id: this.findSelectKey('adAccountPixels'),
          name: this.targetName,
          retention_days: this.collectionPeriod,
          exclusion_retention_days: this.unvisitedPeriod,

          detail: this.findSelectKey('selectCustomer'),
          input_percent: this.findSelectKey('selectSub'),

          sources: this.convertUtmName(this.gAddData.utm_source),
          mediums: this.convertUtmName(this.gAddData.utm_medium),
          campaigns: this.convertUtmName(this.gAddData.utm_campaign),
          terms: this.convertUtmName(this.gAddData.utm_term),
          contents: this.convertUtmName(this.gAddData.utm_content),
          customs: this.convertUtmName(this.gAddData.custom),
          inclusions: this.makeInclusions(),
          exclusions: this.makeExclusions()
        }

        this.$http.put('/pickdata_account_target/custom_target', params)
        .then((response) => {
          var success = response.data.success
          if (success == "YES") {
            // success
            this.$eventBus.$emit('getAccountTarget')
          } else {
            this.dialogOpen('구글애널리틱스 타겟 생성 실패', 'alert')
            throw('success: ' + success)
          }
          this.$emit('close')
        })
        .catch(err => {
          this.$emit('close')
          console.log('/pickdata_account_target/custom_target delete: ', err)
        })
      }

      // 모드별 동작
      this.nextStage = true
      this.dialogShow = false
    },

    terms_reset(){
      this.selectCustomer.emptyText = "전체 고객"
      this.subSelect = false
      this.subInput = false
    },

    terms_add_reset(){
      this.terms_add = false
      this.removeSelectCustomer.emptyText = ""
    },

    terms_delete_reset() {
      this.terms_delete = false
      this.removeSelectCustomer.emptyText = ""
    },

    // 다이얼로그 취소 클릭시
    dialogCancel () {
      this.nextStage = false
      this.dialogShow = false
    },

    wTabs (num, obj) {
      const tabs = Object.keys(this[obj])
      for(let i = 0; i < tabs.length; i++) {
        if(num == i) {
          this.wTab[tabs[i]] = true
        }else{
          this.wTab[tabs[i]] = false
        }
      }
    },

    addAnalyData () {
      const elId = event.target.id
      const utmKey = document.getElementById('utm_key').getElementsByClassName('select')[0].innerText.replace(/\s/gi, "")
      const utmName = document.getElementById('utm_name').value
      const gData = this.gAddData[utmKey]
      const keyData = this.selectUtmType.textList
      const newData = {
        number: gData.length + 1,
        name: utmName
      }
      if(utmName != '') {
        // const newData = utmName
        //선택필드 탭 활성화
        for(let i = 0; i < keyData.length; i++) {
          if (keyData[i] === utmKey) {
            this.wTabs(i, 'wTab')
            break
          }
        }
        //동일 이름 체크
        for(let i = 0; i < gData.length; i++) {
          if (gData[i].name === utmName) {
            //컨펌,얼럿 텍스트 - 메세지창 타입(confirm,alert) - 독립적모드이름(alert 메세지시 사용 X)
            this.dialogOpen('같은 UTM값이 존재합니다.', 'alert')
            this.inputUtmName = ''
            return false
          }
        }
        gData.push(newData)
        this.inputUtmName = ''
      }else{
        this.dialogOpen('UTM값을 먼저 입력해주세요.', 'alert')
        return false
      }
    },

    deleteAnalyData (item, key){
      const elId = event.target.closest('.analytics_tab_contents').id
      const addListEl = document.getElementById(elId)
      const addlistLi = addListEl.getElementsByTagName('li')

      if(item === 'all') {
        this.gAddData[key].splice(0, addlistLi.length)
      }else{
        this.gAddData[key].splice(this.gAddData[key].indexOf(item), 1)
      }
    },

    // v1.2 추가내용 시작 (기존 Fucntion 수정 - 셀렉트 박스 클릭시 처리)
    selectOnClick (item) {
      const key = event.target.closest('.select_btn').getAttribute('data-key')
      const textCheck = item.replace(/\s/gi, "")

      // 서브 입력창 체크
      if (key === 'selectCustomer') {
        this.terms_add = false
        this.terms_delete = false

        this.subSelect = false
        this.subInput = false
        if (textCheck === '이용시간상위고객' || key === 'selectSub') {
          this.subSelect = true
        } else if(textCheck === '특정일동안미방문고객') {
          this.subInput = true
        }
      } else if (key === 'addSelectCustomer') {
        if (item == this.removeSelectCustomer.emptyText){
          this.terms_add_reset()
          this.terms_delete_reset()
        }

        this.addSubSelect = false
        this.addSubInput = false
        if (textCheck === '이용시간상위고객' || key === 'selectSub') {
          this.addSubSelect = true
        } else if(textCheck === '특정일동안미방문고객') {
          this.addSubInput = true
        }
      } else if (key === 'removeSelectCustomer') {
        if (item == this.removeSelectCustomer.emptyText){
          this.terms_add_reset()
          this.terms_delete_reset()
        }

        this.removeSubSelect = false
        this.removeSubInput = false
        if (textCheck === '이용시간상위고객' || key === 'selectSub') {
          this.removeSubSelect = true
        } else if(textCheck === '특정일동안미방문고객') {
          this.removeSubInput = true
        }
      }

      this[key].emptyText = item
    },
    // v1.2 추가내용 끝 (기존 Fucntion 수정 - 셀렉트 박스 클릭시 처리)

    findSelectText (selectName, key) {
      // Select Text 가져오기
      const textList = this[selectName].textList
      const keyList = this[selectName].keyList
      return textList[keyList.indexOf(key)]
    },

    findSelectKey (selectName) {
      // Select Key 가져오기
      const emptyText = this[selectName].emptyText
      const textList = this[selectName].textList
      const keyList = this[selectName].keyList
      return keyList[textList.indexOf(emptyText)]
    },

    convertUtmName (data) {
      let result = []
      data.forEach(function (item, index) {
        result.push(item['name'])
      })
      return result
    },

    // Create Target Dialog
    createUtmTarget () {
      if (this.collectionPeriod.length === 0) {
        this.dialogOpen('수집 기간을 입력해주세요.', 'alert')
      } else if (this.unvisitedPeriod.length === 0) {
        this.dialogOpen('미방문 기간을 입력해주세요.', 'alert')
      } else if (this.targetName.length === 0) {
        this.dialogOpen('타겟 이름을 입력해주세요.', 'alert')
      } else {
        this.dialogOpen('입력한 내용으로 타겟을 생성하시겠습니까?', 'confirm', 'createUtmTarget')
      }
    },

    // Delete Target Dialog
    deleteUtmTarget () {
      this.dialogOpen('삭제하시겠습니까?', 'confirm', 'deleteUtmTarget')
    },

    // Update Target Dialog
    updateUtmTarget () {
      if (this.collectionPeriod.length === 0) {
        this.dialogOpen('수집 기간을 입력해주세요.', 'alert')
      } else if (this.unvisitedPeriod.length === 0) {
        this.dialogOpen('미방문 기간을 입력해주세요.', 'alert')
      } else if (this.targetName.length === 0) {
        this.dialogOpen('타겟 이름을 입력해주세요.', 'alert')
      } else {
        this.dialogOpen('수정하시겠습니까?', 'confirm', 'updateUtmTarget')
      }
    },

    modifyUtmTarget () {
      const description = this.makeItem.description
      const params = description.params
      const detail = params.detail
      // v1.2 추가내용 시작 (수정시 화면 출력처리 호출)
      const inclusions = (params.inclusions !== 'undefined') ? params.inclusions : []
      const exclusions = (params.exclusions !== 'undefined') ? params.exclusions : []
      this.modifyInclusions(inclusions)
      this.modifyExclusions(exclusions)
      // v1.2 추가내용 끝 (수정시 화면 출력처리 호출)

      // 사용 픽셀
      this.adAccountPixels.emptyText = this.findSelectText('adAccountPixels', params.pixel_id)

      // 수집 기간
      this.collectionPeriod = numberFormatter(description.retention_days)

      // 타겟 이름
      this.targetName = this.makeItem.name

      // 타겟 모수
      const displayCount = this.makeItem.display_count

      if (displayCount === '규모가 적음') {
        this.audienceSize = displayCount
        this.isNumber = false
      } else if (displayCount === '생성중') {
        this.audienceSize = displayCount
        this.isNumber = false
      } else {
        this.audienceSize = numberFormatter(this.makeItem.display_count)
        this.isNumber = true
      }

      // 아래 UTM 속성으로 유입된 사람중 @
      if (detail === 'total') {
        // 전체 고객
        this.selectCustomer.emptyText = '전체 고객'
      } else if (detail === 'usage_time_top') {
        // 이용 시간 상위 고객
        this.selectCustomer.emptyText = '이용 시간 상위 고객'
        this.subSelect = true
        this.selectSub.emptyText = params.input_percent + '%'
      } else if (detail === 'non_visit') {
        // 특정일 동안 미방문 고객
        this.selectCustomer.emptyText = '특정일 동안 미방문 고객'
        this.subInput = true
      } else if (detail === 'purchase') {
        // 구매 고객
        this.selectCustomer.emptyText = '구매고객'
      } else if (detail === 'non_purchase') {
        // 미구매 고객
        this.selectCustomer.emptyText = '미 구매고객'
      } else if (detail === 'add_to_cart') {
        // 장바구니 이용 고객
        this.selectCustomer.emptyText = '장바구니 이용 고객'
      } else if (detail === 'conversion') {
        // 전환완료 고객
        this.selectCustomer.emptyText = '전환완료 고객'
      } else if (detail === 'non_conversion') {
        // 미전환 고객
        this.selectCustomer.emptyText = '미 전환 고객'
      } else if (detail === 'registration') {
        // 회원가입 고객
        this.selectCustomer.emptyText = '회원가입 고객'
      }

      // UTM 속성
      params.sources.forEach(source => {
        let data = { name: source }
        this.gAddData.utm_source.push(data)
      })

      params.mediums.forEach(medium => {
        let data = { name: medium }
        this.gAddData.utm_medium.push(data)
      })

      params.campaigns.forEach(campaign => {
        let data = { name: campaign }
        this.gAddData.utm_campaign.push(data)
      })

      params.terms.forEach(term => {
        let data = { name: term }
        this.gAddData.utm_term.push(data)
      })

      params.contents.forEach(content => {
        let data = { name: content }
        this.gAddData.utm_content.push(data)
      })

      params.customs.forEach(custom => {
        let data = { name: custom }
        this.gAddData.custom.push(data)
      })

      // this.gAddData.utm_source = params.sources.slice(0)
      // this.gAddData.utm_medium = params.mediums.slice(0)
      // this.gAddData.utm_campaign = params.campaigns.slice(0)
      // this.gAddData.utm_term = params.terms.slice(0)
      // this.gAddData.utm_content = params.contents.slice(0)
      // this.gAddData.utm_custom = params.customs.slice(0)
    },

    // v1.2 추가내용 시작 (수정시 화면 출력처리)
    modifyInclusions (inclusions) {
      if (inclusions.length > 0) {
        let defaultDetails = inclusions[0]
        let detail = defaultDetails.detail
        let exclusionRetentionDays = defaultDetails.exclusion_retention_days
        let inputPercent = defaultDetails.input_percent

        // 사이트 방문자중 @
        if (detail === 'total') {
          // 전체 고객
          this.selectCustomer.emptyText = '전체 고객'
        } else if (detail === 'usage_time_top') {
          // 이용 시간 상위 고객
          this.selectCustomer.emptyText = '이용 시간 상위 고객'
          this.selectSub.emptyText = inputPercent + '%'
          this.subSelect = true
        } else if (detail === 'non_visit') {
          // 특정일 동안 미방문 고객
          this.selectCustomer.emptyText = '특정일 동안 미방문 고객'
          this.unvisitedPeriod = exclusionRetentionDays
          this.subInput = true
        } else if (detail === 'purchase') {
          // 구매 고객
          this.selectCustomer.emptyText = '구매고객'
        } else if (detail === 'non_purchase') {
          // 미구매 고객
          this.selectCustomer.emptyText = '미 구매고객'
        } else if (detail === 'add_to_cart') {
          // 장바구니 이용 고객
          this.selectCustomer.emptyText = '장바구니 이용 고객'
        } else if (detail === 'conversion') {
          // 전환완료 고객
          this.selectCustomer.emptyText = '전환완료 고객'
        } else if (detail === 'non_conversion') {
          // 미전환 고객
          this.selectCustomer.emptyText = '미 전환 고객'
        } else if (detail === 'registration') {
          // 회원가입 고객
          this.selectCustomer.emptyText = '회원가입 고객'
        } else {
          console.log('nothing..', detail)
        }

        if (inclusions.length > 1) {
          let addDetails = inclusions[1]
          let addDetail = addDetails.detail
          let addExclusionRetentionDays = addDetails.exclusion_retention_days
          let addInputPercent = addDetails.input_percent
          this.terms_add = true
          // this.terms_delete = true

          // 사이트 방문자중 @
          if (addDetail === 'total') {
            // 전체 고객
            this.addSelectCustomer.emptyText = '전체 고객'
          } else if (addDetail === 'usage_time_top') {
            // 이용 시간 상위 고객
            this.addSelectCustomer.emptyText = '이용 시간 상위 고객'
            this.addSelectSub.emptyText = addInputPercent + '%'
            this.addSubSelect = true
          } else if (addDetail === 'non_visit') {
            // 특정일 동안 미방문 고객
            this.addSelectCustomer.emptyText = '특정일 동안 미방문 고객'
            this.addUnvisitedPeriod = addExclusionRetentionDays
            this.addSubInput = true
          } else if (addDetail === 'purchase') {
            // 구매 고객
            this.addSelectCustomer.emptyText = '구매고객'
          } else if (addDetail === 'non_purchase') {
            // 미구매 고객
            this.addSelectCustomer.emptyText = '미 구매고객'
          } else if (addDetail === 'add_to_cart') {
            // 장바구니 이용 고객
            this.addSelectCustomer.emptyText = '장바구니 이용 고객'
          } else if (addDetail === 'conversion') {
            // 전환완료 고객
            this.addSelectCustomer.emptyText = '전환완료 고객'
          } else if (addDetail === 'non_conversion') {
            // 미전환 고객
            this.addSelectCustomer.emptyText = '미 전환 고객'
          } else if (addDetail === 'registration') {
            // 회원가입 고객
            this.addSelectCustomer.emptyText = '회원가입 고객'
          } else {
            console.log('nothing..')
          }
        }
      } else {
        // v.1.2 이전 생성 타겟일 때,
        return
      }
    },

    modifyExclusions (exclusions) {
      if (exclusions.length > 0) {
        let removeDetails = exclusions[0]
        let removeDetail = removeDetails.detail
        let removeExclusionRetentionDays = removeDetails.exclusion_retention_days
        let removeInputPercent = removeDetails.input_percent
        this.terms_delete = true

        // 사이트 방문자중 @
        if (removeDetail === 'total') {
          // 전체 고객
          this.removeSelectCustomer.emptyText = '전체 고객'
        } else if (removeDetail === 'usage_time_top') {
          // 이용 시간 상위 고객
          this.removeSelectCustomer.emptyText = '이용 시간 상위 고객'
          this.removeSelectSub.emptyText = removeInputPercent + '%'
          this.removeSubSelect = true
        } else if (removeDetail === 'non_visit') {
          // 특정일 동안 미방문 고객
          this.removeSelectCustomer.emptyText = '특정일 동안 미방문 고객'
          this.removeUnvisitedPeriod = removeExclusionRetentionDays
          this.removeSubInput = true
        } else if (removeDetail === 'purchase') {
          // 구매 고객
          this.removeSelectCustomer.emptyText = '구매고객'
        } else if (removeDetail === 'non_purchase') {
          // 미구매 고객
          this.removeSelectCustomer.emptyText = '미 구매고객'
        } else if (removeDetail === 'add_to_cart') {
          // 장바구니 이용 고객
          this.removeSelectCustomer.emptyText = '장바구니 이용 고객'
        } else if (removeDetail === 'conversion') {
          // 전환완료 고객
          this.removeSelectCustomer.emptyText = '전환완료 고객'
        } else if (removeDetail === 'non_conversion') {
          // 미전환 고객
          this.removeSelectCustomer.emptyText = '미 전환 고객'
        } else if (removeDetail === 'registration') {
          // 회원가입 고객
          this.removeSelectCustomer.emptyText = '회원가입 고객'
        } else {
          console.log('nothing..')
        }
      } else {
        // 없을때는 패스
        return
      }
    }
    // v1.2 추가내용 끝 (수정시 화면 출력처리)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.account_widget{
  .add_info{
    .account_title{width:204px; text-align:right;}
  }
}
</style>
