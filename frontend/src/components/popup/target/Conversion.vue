<template>
  <div class="target_contents_wrap clearfix" v-if="isShow">
    <transition name="modal">
      <ui-dialog :dialogData="dialogData" v-if='dialogShow' @ok='dialogOk' @cancel="dialogCancel"></ui-dialog>
    </transition>
    <div class="target_contents_inner">
      <div class="target_thead">
        <div class="main_title">
          <div><img src="../../../assets/images/target/target_logo_08.png" alt="neo"></div>
          <div class="title_info">
            <p>단계별 전환</p>
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
              <div class="account_title">전환 관련 속성 선택</div>
              <div>
                <ui-select :selectData="this.selectConversionUser" data-key="selectConversionUser" :onClick="selectOnClick"></ui-select>
              </div>
              <div class="value_input_wrap" v-if="subConversionInput">
                <input type="text" v-model="conversionSubText">
                <p>단계 완료 후 이탈 고객</p>
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
        <div class="target_inner_tbody clearfix">
          <div class="target_generate">
            <div class="account_info_wrap">
              <div class="generate_url_list" v-if="subConversionInput">
                <div class="url_list clearfix">
                  <div class="url_text clearfix">
                    <p>해당 단계 완료 URL</p>
                  </div>
                  <div class="url_input">
                    <input type="text" v-model="conversionCompleteUrl">
                  </div>
                </div>
                <div class="url_list clearfix">
                  <div class="url_text clearfix">
                    <p>다음 단계 완료 URL</p>
                  </div>
                  <div class="url_input">
                    <input type="text" v-model="conversionNextCompleteUrl">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="makeType === 'modify'" class="modify_prologue">* 설정 수정시 기존 생성된 타겟과 병합되어 모수가 중복될 수 있습니다. 특별한 상황이 아니면 설정의 수정을 지양해주세요.</div>
        <div class="btn_wrap">
          <button class="before_btn close_pop" @click="clickCancel()">취소</button>
          <button class="next_btn" @click="createConversionTarget()" v-if="makeType == 'add'">타겟 만들기</button>
          <button class="delete_btn" @click="deleteConversionTarget()" v-if="makeType == 'modify'">삭제</button>
          <button class="next_btn" @click="updateConversionTarget()" v-if="makeType == 'modify'">타겟 수정하기</button>
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
  name: 'Conversion',

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
    const textCheck = (this.selectConversionUser.emptyText).replace(/\s/gi, "")
    if(textCheck === '특정단계완료(URL)'){
      this.subConversionInput = true
    }
    this.$eventBus.$on('modifyConversionTarget', this.modifyConversionTarget)
  },

  beforeDestroy () {
    this.$eventBus.$off('modifyConversionTarget', this.modifyConversionTarget)
  },

  data () {
    return {
      collectionPeriod: '30',
      targetName: '',
      audienceSize: '-',
      isNumber: false,

      conversionSubText: '',
      conversionCompleteUrl: '',
      conversionNextCompleteUrl: '',

      subConversionInput: false,

      dialogShow: false,
      dialogData: {
        emptyText:'sample',
        type:'confirm',
        mode:'sample'
      },

      selectConversionUser: this.$store.state.conversionDetails,
      addSelectCustomer: {
        textList: [
        ],
        keyList: [
        ]
      },
      removeSelectCustomer: {
        textList: [
        ],
        keyList: [
        ]
      },

      terms_add : false,
      terms_delete : false

    }
  },

  watch: {
    collectionPeriod (day) {
      if (day > 180) {
        // 컨펌,얼럿 텍스트 - 메세지창 타입(confirm,alert) - 독립적모드이름(alert 메세지시 사용 X)
        this.dialogOpen('수집 기간은 최대 180일까지만 가능합니다.', 'alert')
        this.collectionPeriod = 180
      } else if (this.collectionPeriod === '0') {
        alert('수집 기간은 최소 1일입니다.')
        this.collectionPeriod = 1
      }
    },

    targetName (name) {
      if (name.length > 48) {
        // 컨펌,얼럿 텍스트 - 메세지창 타입(confirm,alert) - 독립적모드이름(alert 메세지시 사용 X)
        this.dialogOpen('타겟 이름은 최대 48자까지만 가능합니다.', 'alert')
        this.targetName = name.substr(0,48)
      }
    },

    conversionSubText (name) {
      if (name.length > 8) {
        // 컨펌,얼럿 텍스트 - 메세지창 타입(confirm,alert) - 독립적모드이름(alert 메세지시 사용 X)
        this.dialogOpen('최대 8자까지만 가능합니다.', 'alert')
        this.conversionSubText = name.substr(0,8)
      }
    }
  },

  methods: {

    // v1.2 추가내용 시작 (파라메터 생성 Function)
    makeInclusions () {
      let inclusions = []
      let defaultDetails = {
        detail: this.findSelectKey('selectConversionUser'),
      }
      let addDetails = {
        detail: this.findSelectKey('addSelectCustomer'),
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
      this.dialogShow = true;
    },

    dialogOk () {
      const mode = this.dialogData.mode

      if(mode == 'conversion') {
        this.createVisitSpecificPagesNext()
      } else if (mode === 'conversionDelete') {
        this.$emit('deleteCustomTarget', this.makeItem.id)
      }

      //모드별 동작
      this.nextStage = true
      this.dialogShow = false;
    },

    click_terms_add() {
      this.terms_add = true
      this.addSelectCustomer = {
        textList: [],keyList: []
      }

      for(let i = 0; i < this.selectConversionUser.keyList.length; i++) {
         let check_result = true
         if (this.selectConversionUser.textList[i] == '전체 고객'){
           check_result = false
         }
         if (this.terms_delete == true && this.removeSelectCustomer.emptyText == this.selectConversionUser.textList[i]){
           check_result = false
         }
         if (this.selectConversionUser.textList[i] == this.selectConversionUser.emptyText ) {
           check_result = false
         }

         if(check_result == true){
           this.addSelectCustomer.keyList.push(this.selectConversionUser.keyList[i])
           this.addSelectCustomer.textList.push(this.selectConversionUser.textList[i])
         }
      }

      if(this.addSelectCustomer.keyList.length > 0){
        this.subConversionInput = false
        const textCheck = this.addSelectCustomer.textList[0]

        if (textCheck.replace(/\s/gi, "") === '특정단계완료(URL)') {
          this.subConversionInput = true
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

      for(let i = 0; i < this.selectConversionUser.keyList.length; i++) {
         let check_result = true
         if (this.selectConversionUser.textList[i] == '전체 고객'){
           check_result = false
         }
         if (this.terms_add == true && this.addSelectCustomer.emptyText == this.selectConversionUser.textList[i]){
           check_result = false
         }
         if (this.selectConversionUser.textList[i] == this.selectConversionUser.emptyText ) {
           check_result = false
         }

         if(check_result == true){
           this.removeSelectCustomer.keyList.push(this.selectConversionUser.keyList[i])
           this.removeSelectCustomer.textList.push(this.selectConversionUser.textList[i])
         }
      }

      if (this.removeSelectCustomer.keyList.length> 0){
        this.subConversionInput = false
        const textCheck = this.removeSelectCustomer.textList[0]

        if (textCheck.replace(/\s/gi, "") === '특정단계완료(URL)') {
          this.subConversionInput = true
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

      if (mode === 'createConversion') {
        // Create Target -----------------------------------------------------------------
        let params = {
          fb_ad_account_id: localStorage.getItem('fb_ad_account_id'),
          target_type: 'conversion',
          pixel_id: this.findSelectKey('adAccountPixels'),
          name: this.targetName,
          retention_days: this.collectionPeriod,

          detail: this.findSelectKey('selectConversionUser'),

          // v1.2 추가내용 시작 (파라메터 생성)
          inclusions: this.makeInclusions(),
          exclusions: this.makeExclusions()
          // v1.2 추가내용 끝 (파라메터 생성)

        }
        if (this.findSelectKey('selectConversionUser') == 'conversion url') {
          params['step_name'] = this.conversionSubText
          params['current_complete_url'] = this.conversionCompleteUrl
          params['next_complete_url'] = this.conversionNextCompleteUrl
        }

        this.$http.post('/pickdata_account_target/custom_target', params)
        .then((response) => {
          var success = response.data.success
          if (success == "YES") {
            // success
            this.$eventBus.$emit('getAccountTarget')
          } else {
            //컨펌,얼럿 텍스트 - 메세지창 타입(confirm,alert) - 독립적모드이름(alert 메세지시 사용 X)
            this.dialogOpen('단계별 전환 타겟 생성 실패', 'alert')
            throw('success: ' + success)
          }
          this.$emit('close')
        })
        .catch(err => {
          this.$emit('close')
          console.log('/pickdata_account_target/custom_target: ', err)
        })


      } else if (mode === 'deleteConversion') {
        // Delete Target -----------------------------------------------------------------
        this.$emit('deleteCustomTarget', this.makeItem.id)


      } else if (mode === 'updateConversion') {
        // Update Target -----------------------------------------------------------------
        let params = {
          pickdata_account_target_id: this.makeItem.id,
          fb_ad_account_id: localStorage.getItem('fb_ad_account_id'),
          target_type: 'conversion',
          pixel_id: this.findSelectKey('adAccountPixels'),
          name: this.targetName,
          retention_days: this.collectionPeriod,

          detail: this.findSelectKey('selectConversionUser'),

          // v1.2 추가내용 시작 (파라메터 생성)
          inclusions: this.makeInclusions(),
          exclusions: this.makeExclusions()
          // v1.2 추가내용 끝 (파라메터 생성)
        }
        if (this.findSelectKey('selectConversionUser') == 'conversion url') {
          params['step_name'] = this.conversionSubText
          params['current_complete_url'] = this.conversionCompleteUrl
          params['next_complete_url'] = this.conversionNextCompleteUrl
        }

        this.$http.put('/pickdata_account_target/custom_target', params)
        .then((response) => {
          var success = response.data.success
          if (success == "YES") {
            // success
            this.$eventBus.$emit('getAccountTarget')
          } else {
            this.dialogOpen('단계별 전환 타겟 수정 실패', 'alert')
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
      this.nextStay = true
      this.dialogShow = false
    },

    dialogCancel () {
      this.nextStage = false;
      this.dialogShow = false;
    },

    terms_reset(){
      this.selectConversionUser.emptyText = "전체 고객"
      this.subConversionInput = false
    },

    terms_add_reset(){
      this.terms_add = false
      this.removeSelectCustomer.emptyText = ""
    },

    terms_delete_reset() {
      this.terms_delete = false
      this.removeSelectCustomer.emptyText = ""
    },

    selectOnClick (item) {
      const key = event.target.closest('.select_btn').getAttribute('data-key')
      const textCheck = item.replace(/\s/gi, "")

      this.subConversionInput = false

      if (key === 'selectCustomer') {
        this.terms_add = false
        this.terms_delete = false
      } else if (key === 'addSelectCustomer') {
        if (item == this.removeSelectCustomer.emptyText){
          this.terms_add_reset()
          this.terms_delete_reset()
        }
      } else if (key === 'removeSelectCustomer') {
        if (item == this.removeSelectCustomer.emptyText){
          this.terms_add_reset()
          this.terms_delete_reset()
        }
      }

      if(textCheck === '특정단계완료(URL)'){
        this.subConversionInput = true
      }
      this[key].emptyText = item
    },

    findSelectText (selectName, key) {
      // Select Text 가져오기
      const textList = this[selectName].textList
      const keyList = this[selectName].keyList
      return textList[keyList.indexOf(key)]
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

    // Create Target Dialog
    createConversionTarget () {
      if (this.collectionPeriod.length === 0) {
        //컨펌,얼럿 텍스트 - 메세지창 타입(confirm,alert) - 독립적모드이름(alert 메세지시 사용 X)
        this.dialogOpen('수집 기간을 입력해주세요.', 'alert')
      } else if (this.targetName.length === 0) {
        //컨펌,얼럿 텍스트 - 메세지창 타입(confirm,alert) - 독립적모드이름(alert 메세지시 사용 X)
        this.dialogOpen('타겟 이름을 입력해주세요.', 'alert')
      } else {
        //컨펌,얼럿 텍스트 - 메세지창 타입(confirm,alert) - 독립적모드이름(alert 메세지시 사용 X)
        this.dialogOpen('입력한 내용으로 타겟을 생성하시겠습니까?', 'confirm', 'createConversion')
      }
    },

    // Delete Target Dialog
    deleteConversionTarget () {
      this.dialogOpen('삭제하시겠습니까?', 'confirm', 'deleteConversion')
    },

    // Update Target Dialog
    updateConversionTarget () {
      if (this.collectionPeriod.length === 0) {
        this.dialogOpen('수집 기간을 입력해주세요.', 'alert')
      } else if (this.targetName.length === 0) {
        this.dialogOpen('타겟 이름을 입력해주세요.', 'alert')
      } else {
        this.dialogOpen('수정하시겠습니까?', 'confirm', 'updateConversion')
      }
    },

    modifyConversionTarget () {
      const description = this.makeItem.description
      const params = description.params
      const detail = params.detail

      // v1.2 추가내용 시작 (수정시 화면 출력처리 호출)
      const inclusions = (params.inclusions !== 'undefined') ? params.inclusions : []
      const exclusions = (params.exclusions !== 'undefined') ? params.exclusions : []

      console.log(inclusions)
      console.log(exclusions)

      this.modifyInclusions(inclusions, params)
      this.modifyExclusions(exclusions, params)
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

      // 사이트 방문자중 @
      if (detail === 'non_conversion') {
        // 미 전환 고객
        this.selectConversionUser.emptyText = '미 전환 고객'
      } else if (detail === 'conversion 1step') {
        // 전환 1단계 완료 고객
        this.selectConversionUser.emptyText = '전환 1단계 완료 고객'
      } else if (detail === 'conversion 2step') {
        // 전환 2단계 완료 고객
        this.selectConversionUser.emptyText = '전환 2단계 완료 고객'
      } else if (detail === 'conversion 3step') {
        // 전환 3단계 완료 고객
        this.selectConversionUser.emptyText = '전환 3단계 완료 고객'
      } else if (detail === 'conversion 4step') {
        // 전환 4단계 완료 고객
        this.selectConversionUser.emptyText = '전환 4단계 완료 고객'
      } else if (detail === 'conversion 5step') {
        // 전환 5단계 완료 고객
        this.selectConversionUser.emptyText = '전환 5단계 완료 고객'
      } else if (detail === 'conversion url') {
        // 특정 단계 완료(URL)
        this.selectConversionUser.emptyText = '특정 단계 완료(URL)'
        this.subConversionInput = true
        this.conversionSubText = params.step_name
        this.conversionCompleteUrl = params.current_complete_url
        this.conversionNextCompleteUrl = params.next_complete_url
      } else {
        console.log('nothing..', detail)
      }
    },

    // v1.2 추가내용 시작 (수정시 화면 출력처리)
    modifyInclusions (inclusions, params) {
      console.log("modifyInclusions")
      if (inclusions.length > 0) {
        let defaultDetails = inclusions[0]
        let detail = defaultDetails.detail

        if (detail === 'conversion') {
          this.selectConversionUser.emptyText = '전환완료 고객'
        } else if (detail === 'non_conversion') {
          this.selectConversionUser.emptyText = '미 전환 고객'
        } else if (detail === 'conversion 1step') {
          this.selectConversionUser.emptyText = '전환 1단계 완료 고객'
        } else if (detail === 'conversion 2step') {
          this.selectConversionUser.emptyText = '전환 2단계 완료 고객'
        } else if (detail === 'conversion 3step') {
          this.selectConversionUser.emptyText = '전환 3단계 완료 고객'
        } else if (detail === 'conversion 4step') {
          this.selectConversionUser.emptyText = '전환 4단계 완료 고객'
        } else if (detail === 'conversion 5step') {
          this.selectConversionUser.emptyText = '전환 5단계 완료 고객'
        } else if (detail === 'conversion url') {
          this.selectConversionUser.emptyText = '특정 단계 완료(URL)'
          this.subConversionInput = true
          this.conversionSubText = params.step_name
          this.conversionCompleteUrl = params.current_complete_url
          this.conversionNextCompleteUrl = params.next_complete_url

        } else {
          console.log('nothing..', detail)
        }

        if (inclusions.length > 1) {
          let addDetails = inclusions[1]
          let addDetail = addDetails.detail
          this.terms_add = true

          // 사이트 방문자중 @
          if (addDetail === 'conversion') {
            this.addSelectCustomer.emptyText = '전환완료 고객'
          } else if (addDetail === 'non_conversion') {
            this.addSelectCustomer.emptyText = '미 전환 고객'
          } else if (addDetail === 'conversion 1step') {
            this.addSelectCustomer.emptyText = '전환 1단계 완료 고객'
          } else if (addDetail === 'conversion 2step') {
            this.addSelectCustomer.emptyText = '전환 2단계 완료 고객'
          } else if (addDetail === 'conversion 3step') {
            this.addSelectCustomer.emptyText = '전환 3단계 완료 고객'
          } else if (addDetail === 'conversion 4step') {
            this.addSelectCustomer.emptyText = '전환 4단계 완료 고객'
          } else if (addDetail === 'conversion 5step') {
            this.addSelectCustomer.emptyText = '전환 5단계 완료 고객'
          } else if (addDetail === 'conversion url') {
            this.addSelectCustomer.emptyText = '특정 단계 완료(URL)'
            this.subConversionInput = true
            this.conversionSubText = params.step_name
            this.conversionCompleteUrl = params.current_complete_url
            this.conversionNextCompleteUrl = params.next_complete_url
          } else {
            console.log('nothing..')
          }
        }
      } else {
        // v.1.2 이전 생성 타겟일 때,
        return
      }
    },

    modifyExclusions (exclusions, params) {
      console.log("modifyExclusions")
      if (exclusions.length > 0) {
        let removeDetails = exclusions[0]
        let removeDetail = removeDetails.detail
        this.terms_delete = true

        // 사이트 방문자중 @
        if (removeDetail === 'conversion') {
          this.removeSelectCustomer.emptyText = '전환완료 고객'
        } else if (removeDetail === 'non_conversion') {
          this.removeSelectCustomer.emptyText = '미 전환 고객'
        } else if (removeDetail === 'conversion 1step') {
          this.removeSelectCustomer.emptyText = '전환 1단계 완료 고객'
        } else if (removeDetail === 'conversion 2step') {
          this.removeSelectCustomer.emptyText = '전환 2단계 완료 고객'
        } else if (removeDetail === 'conversion 3step') {
          this.removeSelectCustomer.emptyText = '전환 3단계 완료 고객'
        } else if (removeDetail === 'conversion 4step') {
          this.removeSelectCustomer.emptyText = '전환 4단계 완료 고객'
        } else if (removeDetail === 'conversion 5step') {
          this.removeSelectCustomer.emptyText = '전환 5단계 완료 고객'
        } else if (removeDetail === 'conversion url') {
          this.removeSelectCustomer.emptyText = '특정 단계 완료(URL)'
          this.subConversionInput = true
          this.conversionSubText = params.step_name
          this.conversionCompleteUrl = params.current_complete_url
          this.conversionNextCompleteUrl = params.next_complete_url
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
      .account_title{width:109px; text-align:right;}
    }
  }
  .value_input_wrap{margin-right:10px!important;
    input{width:50px!important;}
  }
</style>
