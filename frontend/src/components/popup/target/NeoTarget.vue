<template>
  <div class="target_contents_wrap clearfix pop-scroll neo_target_pop" v-if="isShow">
    <transition name="modal">
      <ui-dialog :dialogData="dialogData" v-if="dialogShow" @ok="dialogOk()" @cancel="dialogCancel()"></ui-dialog>
    </transition>
    <div class="target_contents_inner">
      <div class="target_thead">
        <div class="main_title">
          <div><img src="../../../assets/images/target/target_logo_03.png" alt="neo"></div>
          <div class="title_info">
            <p>NEO타겟</p>
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
        <div class="target_type">
          <div class="contents_title">Neo 유형</div>
          <ul>
            <li>
              <div class="result_check"><input type="radio" id="target_type01" @change="wTabs(0,'wTab')" name="neo_type" value="media" v-model="neoTargetType" checked><label for="target_type01">매체</label></div>
            </li>
            <li>
              <div class="result_check"><input type="radio" id="target_type02" name="neo_type" @change="wTabs(1,'wTab')" value="group" v-model="neoTargetType"><label for="target_type02">그룹</label></div>
            </li>
            <li>
              <div class="result_check"><input type="radio" id="target_type03" name="neo_type"  @change="wTabs(2,'wTab')" value="keyword" v-model="neoTargetType"><label for="target_type03">키워드</label></div>
            </li>
            <li>
              <div class="result_check"><input type="radio" id="target_type04" name="neo_type" @change="wTabs(3,'wTab')" value="csv" v-model="neoTargetType"><label for="target_type04">CSV업로드</label></div>
            </li>
          </ul>
        </div>
      </div>
      <div class="target_tbody">
        <div class="target_inner_tbody clearfix">
          <!-- 매체 -->
          <div class="account_widget_wrap" v-if="wTab.tab1">
            <div class="account_widget">
              <div class="account_info_wrap">
                <div class="account_info target_generate">
                  <div class="account_title">"아래 매체로 유입된 사람" 중</div>
                  <div>
                    <ui-select :selectData="this.selectCustomer" data-key="selectCustomer" :onClick="selectOnClick"></ui-select>
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
            <div class="cate_contents">
              <div class="neo_prologue">* 최근 한달 / 전일 업데이트 기준</div>
              <div class="account_wrap account_wrapper">
                <div class="account_inner_wrap clearfix">
                  <div class="account_left">
                    <div class="advertiser_search_result pop-scroll">
                      <div class="result_list_inner">
                        <div class="result_thead">
                          <ul>
                            <li>
                              <div class="result_check"><input type="checkbox" id="all_check" v-model="selectAllNeoAccounts"><label for="all_check"></label></div>
                              <div class="result_account">
                                <span>광고주명</span>
                                <span>
                                  <div class="sort_wrap">
                                    <!-- 버튼 활성화 class "on"-->
                                    <p class="asc_sort sort_btn" :class="[accountSortClass === 'adv_asc' ? 'on' : '']" @click="onClickAccountSort('adv_asc')"></p>
                                    <!-- 버튼 활성화 -->
                                    <p class="desc_sort sort_btn" :class="[accountSortClass === 'adv_desc' ? 'on' : '']" @click="onClickAccountSort('adv_desc')"></p>
                                  </div>
                                </span>
                              </div>
                              <div class="result_group">
                                <span>매체명</span>
                                <span>
                                  <div class="sort_wrap">
                                    <p class="asc_sort sort_btn" :class="[accountSortClass === 'account_asc' ? 'on' : '']" @click="onClickAccountSort('account_asc')"></p>
                                    <p class="desc_sort sort_btn" :class="[accountSortClass === 'account_desc' ? 'on' : '']" @click="onClickAccountSort('account_desc')"></p>
                                  </div>
                                </span>
                              </div>
                              <div class="result_switch">
                                <span>전환 수</span>
                                <span>
                                  <div class="sort_wrap">
                                    <p class="asc_sort sort_btn" :class="[accountSortClass === 'conversion_asc' ? 'on' : '']" @click="onClickAccountSort('conversion_asc')"></p>
                                    <p class="desc_sort sort_btn" :class="[accountSortClass === 'conversion_desc' ? 'on' : '']" @click="onClickAccountSort('conversion_desc')"></p>
                                  </div>
                                </span>
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div class="result_tbody">
                          <ul id="list-neoaccount">
                            <ui-partial-loading v-if="loadShow"></ui-partial-loading>
                            <li v-for="(neoAccount, index) in neoAccounts" :key="index" v-if="!loadShow">
                              <div class="result_check"><input type="checkbox" v-model="selectedNeoAccounts" :value="neoAccount.centeraccountid" class="result-checkbox" :data-type="'neoAccounts'" :data-id="neoAccount.centeraccountid" :id="'neoAccount-check-' + neoAccount.centeraccountid"><label :for="'neoAccount-check-' + neoAccount.centeraccountid"></label></div>
                              <div class="result_account">{{ neoAccount.advname }}</div>
                              <div class="result_group">{{ neoAccount.accountname }}</div>
                              <div class="result_switch switch_value">{{ neoAccount.count_formatter }}</div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div class="account_add_wrap">
                      <button type="button" v-on:click="checkListNeo('list-neoaccount', 'centeraccountid', 'neoAccounts', 'checkDataNeoAccounts', 'addNeoAccounts', 'selectedNeoAccounts')">선택한 매체 추가</button>
                    </div>
                  </div>
                  <div class="account_right clearfix">
                    <button type="button" v-on:click="deleteListNeo('add-list-neoaccount', 'neoAccounts', 'addNeoAccounts', 'all')" title="전체삭제"><img src="../../../assets/images/target/target_close_btn.png" alt=""></button>
                    <ul id="add-list-neoaccount">
                      <li v-for="(addNeoAccount, index) in addNeoAccounts" :key="index" class="sticker_btn">
                        <span>{{ addNeoAccount.accountname }}</span> <span @click="deleteListNeo('add-list-neoaccount', 'neoAccounts', 'addNeoAccounts', addNeoAccount)" :data-number="addNeoAccount.centeraccountid" title="삭제하기"><img src="../../../assets/images/target/target_list_close.png" alt=""></span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- // 매체 -->
          <!-- 그룹 -->
          <div class="account_widget_wrap" v-if="wTab.tab2">
            <div class="account_widget">
              <div class="account_info_wrap">
                <div class="account_info target_generate">
                  <div class="account_title">"아래 그룹으로 유입된 사람" 중</div>
                  <div>
                    <ui-select :selectData="this.selectCustomer" data-key="selectCustomer" :onClick="selectOnClick"></ui-select>
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
                  <button type="button" @click="terms_delete_reset()">- 삭제</button>
                </div>
              </div>
              <!-- v1.2 추가내용 끝 (화면수정 - 조건 추가) -->
              <!-- // 조건 제외 경우 -->
            </div>
            <div class="cate_contents">
              <div class="neo_prologue">* 최근 한달 / 전일 업데이트 기준</div>
              <div class="account_wrap account_wrapper">
                <div class="account_inner_wrap clearfix">
                  <div class="account_left">
                    <div class="advertiser_search_result pop-scroll">
                      <div class="result_list_inner">
                        <div class="result_thead">
                          <ul>
                            <li>
                              <div class="result_check"><input type="checkbox" id="all_check" v-model="selectAllNeoCampaigns"><label for="all_check"></label></div>
                              <div class="result_account">
                                <span>광고주명</span>
                                <span>
                                  <div class="sort_wrap">
                                    <!-- 버튼 활성화 class "on"-->
                                    <p class="asc_sort sort_btn" :class="[campaignSortClass === 'adv_asc' ? 'on' : '']" @click="onClickCampaignSort('adv_asc')"></p>
                                    <!-- 버튼 활성화 -->
                                    <p class="desc_sort sort_btn" :class="[campaignSortClass === 'adv_desc' ? 'on' : '']" @click="onClickCampaignSort('adv_desc')"></p>
                                  </div>
                                </span>
                              </div>
                              <div class="result_group">
                                <span>그룹명</span>
                                <span>
                                  <div class="sort_wrap">
                                    <p class="asc_sort sort_btn" :class="[campaignSortClass === 'campaign_asc' ? 'on' : '']" @click="onClickCampaignSort('campaign_asc')"></p>
                                    <p class="desc_sort sort_btn" :class="[campaignSortClass === 'campaign_desc' ? 'on' : '']" @click="onClickCampaignSort('campaign_desc')"></p>
                                  </div>
                                </span>
                              </div>
                              <div class="result_switch">
                                <span>전환 수</span>
                                <span>
                                  <div class="sort_wrap">
                                    <p class="asc_sort sort_btn" :class="[campaignSortClass === 'conversion_asc' ? 'on' : '']" @click="onClickCampaignSort('conversion_asc')"></p>
                                    <p class="desc_sort sort_btn" :class="[campaignSortClass === 'conversion_desc' ? 'on' : '']" @click="onClickCampaignSort('conversion_desc')"></p>
                                  </div>
                                </span>
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div class="result_tbody">
                          <ul id="list-neocampaign">
                            <ui-partial-loading v-if="loadShow"></ui-partial-loading>
                            <li v-for="(neoCampaign, index) in neoCampaigns" :key="index" v-if="!loadShow">
                              <div class="result_check"><input type="checkbox" v-model="selectedNeoCampaigns" :value="neoCampaign.campaignid" class="result-checkbox" :data-type="'neoCampaigns'" :data-id="neoCampaign.campaignid" :id="'neoCampaign-check-' + neoCampaign.campaignid"><label :for="'neoCampaign-check-' + neoCampaign.campaignid"></label></div>
                              <div class="result_account">{{ neoCampaign.advname }}</div>
                              <div class="result_group">{{ neoCampaign.campaignname }}</div>
                              <div class="result_switch switch_value">{{ neoCampaign.count_formatter }}</div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div class="account_add_wrap">
                      <button type="button" v-on:click="checkListNeo('list-neocampaign', 'campaignid', 'neoCampaigns', 'checkDataNeoCampaigns', 'addNeoCampaigns', 'selectedNeoCampaigns')">선택한 그룹 추가</button>
                    </div>
                  </div>
                  <div class="account_right clearfix">
                    <button type="button" v-on:click="deleteListNeo('add-list-neocampaign', 'neoCampaigns', 'addNeoCampaigns', 'all')" title="전체삭제"><img src="../../../assets/images/target/target_close_btn.png" alt=""></button>
                    <ul id="add-list-neocampaign">
                      <li v-for="(addNeoCampaign, index) in addNeoCampaigns" :key="index" class="sticker_btn">
                        <span>{{ addNeoCampaign.campaignname }}</span> <span @click="deleteListNeo('add-list-neocampaign', 'neoCampaigns', 'addNeoCampaigns', addNeoCampaign)" :data-number="addNeoCampaign.campaignid" title="삭제하기"><img src="../../../assets/images/target/target_list_close.png" alt=""></span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- // 그룹 -->
          <!-- 키워드 -->
          <div class="account_widget_wrap" v-if="wTab.tab3">
            <div class="account_widget">
              <div class="account_info_wrap">
                <div class="account_info target_generate">
                  <div class="account_title">"아래 키워드로 유입된 사람" 중</div>
                  <div>
                    <ui-select :selectData="this.selectCustomer" data-key="selectCustomer" :onClick="selectOnClick"></ui-select>
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
            <div class="cate_contents">
              <div class="neo_prologue">* 최근 한달 / 전일 업데이트 기준</div>
              <div class="account_wrap account_wrapper">
                <div class="account_inner_wrap clearfix">
                  <div class="account_left">
                    <div class="advertiser_search_result pop-scroll">
                      <div class="result_list_inner">
                        <div class="result_thead">
                          <ul>
                            <li>
                              <div class="result_check"><input type="checkbox" id="all_check" v-model="selectAllNeoKeywords"><label for="all_check"></label></div>
                              <div class="result_account">
                                <span>광고주명</span>
                                <span>
                                  <div class="sort_wrap">
                                    <!-- 버튼 활성화 class "on"-->
                                    <p class="asc_sort sort_btn" :class="[keywordSortClass === 'adv_asc' ? 'on' : '']" @click="onClickKeywordSort('adv_asc')"></p>
                                    <!-- 버튼 활성화 -->
                                    <p class="desc_sort sort_btn" :class="[keywordSortClass === 'adv_desc' ? 'on' : '']" @click="onClickKeywordSort('adv_desc')"></p>
                                  </div>
                                </span>
                              </div>
                              <div class="result_group">
                                <span>키워드명</span>
                                <span>
                                  <div class="sort_wrap">
                                    <p class="asc_sort sort_btn" :class="[keywordSortClass === 'keyword_asc' ? 'on' : '']" @click="onClickKeywordSort('keyword_asc')"></p>
                                    <p class="desc_sort sort_btn" :class="[keywordSortClass === 'keyword_desc' ? 'on' : '']" @click="onClickKeywordSort('keyword_desc')"></p>
                                  </div>
                                </span>
                              </div>
                              <div class="result_switch">
                                <span>전환 수</span>
                                <span>
                                  <div class="sort_wrap">
                                    <p class="asc_sort sort_btn" :class="[keywordSortClass === 'conversion_asc' ? 'on' : '']" @click="onClickKeywordSort('conversion_asc')"></p>
                                    <p class="desc_sort sort_btn" :class="[keywordSortClass === 'conversion_desc' ? 'on' : '']" @click="onClickKeywordSort('conversion_desc')"></p>
                                  </div>
                                </span>
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div class="result_tbody">
                          <ul id="list-neokeyword">
                            <ui-partial-loading v-if="loadShow"></ui-partial-loading>
                            <li v-for="(neoKeyword, index) in neoKeywords" :key="index" v-if="!loadShow">
                              <div class="result_check"><input type="checkbox" v-model="selectedNeoKeywords" :value="neoKeyword.keywordid" class="result-checkbox" :data-type="'neoKeywords'" :data-id="neoKeyword.keywordid" :id="'neoKeyword-check-' + neoKeyword.keywordid"><label :for="'neoKeyword-check-' + neoKeyword.keywordid"></label></div>
                              <div class="result_account">{{ neoKeyword.advname }}</div>
                              <div class="result_group">{{ neoKeyword.keywordname }}</div>
                              <div class="result_switch switch_value">{{ neoKeyword.count_formatter }}</div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div class="account_add_wrap">
                      <button type="button" v-on:click="checkListNeo('list-neokeyword', 'keywordid', 'neoKeywords', 'checkDataNeoKeywords', 'addNeoKeywords', 'selectedNeoKeywords')">선택한 키워드 추가</button>
                    </div>
                  </div>
                  <div class="account_right clearfix">
                    <button type="button" v-on:click="deleteListNeo('add-list-neokeyword', 'neoKeywords', 'addNeoKeywords', 'all')" title="전체삭제"><img src="../../../assets/images/target/target_close_btn.png" alt=""></button>
                    <ul id="add-list-neokeyword">
                      <li v-for="(addNeoKeyword, index) in addNeoKeywords" :key="index" class="sticker_btn">
                        <span>{{ addNeoKeyword.keywordname }}</span> <span @click="deleteListNeo('add-list-neokeyword', 'neoKeywords', 'addNeoKeywords', addNeoKeyword)" :data-number="addNeoKeyword.keywordid" title="삭제하기"><img src="../../../assets/images/target/target_list_close.png" alt=""></span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- // 키워드 -->
          <!-- CSV -->
          <div class="account_widget_wrap" v-if="wTab.tab4">
            <div class="account_widget">
              <div class="account_info_wrap">
                <div class="account_info target_generate">
                  <div class="account_title">"아래 CSV양식으로 유입된 사람" 중</div>
                  <div>
                    <ui-select :selectData="this.selectCustomer" data-key="selectCustomer" :onClick="selectOnClick"></ui-select>
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
            <div class="cate_contents target_excel">
              <div class="neo_prologue">* 최근 한달 / 전일 업데이트 기준</div>
              <div class="account_wrap account_wrapper">
                <div class="account_inner_wrap clearfix">
                  <div class="account_left">
                    <strong>양식에 맞추어 CSV파일을 업로드 해주세요.</strong>
                    <p>양식에 맞추어 CSV파일을 업로드 해주시면,</p>
                    <p>해당 파라미터를 타겟으로 만들 수 있습니다.</p>
                    <div class="excel_wrap">
                      <div class="download_wrap clearfix">
                        <button><strong>CSV업로드</strong></button>
                        <button @click="downloadTemplate()">양식 다운로드</button>
                      </div>
                      <div class="input_wrap clearfix">
                        <div>
                          <input type="file" @change="uploadTemplate($event)">
                        </div>
                      </div>
                      <button class="upload_btn view_alert" @click="upoloadNeoTargetFile()"><strong>업로드</strong></button>
                    </div>
                  </div>
                  <div class="account_right clearfix">
                    <button type="button" v-on:click="deleteAddCsvItems('all')" title="전체삭제"><img src="../../../assets/images/target/target_close_btn.png" alt=""></button>
                    <ul id="add-list-csv">
                      <li v-for="(item, index) in addCsvItems" :key="index" class="sticker_btn">
                        <span>{{ item.name }}</span> <span @click="deleteAddCsvItems(item)" :data-number="item.name" title="삭제하기"><img src="../../../assets/images/target/target_list_close.png" alt=""></span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- // CSV -->
        </div>
      </div>
    </div>
    <div v-if="makeType === 'modify'" class="modify_prologue">* 설정 수정시 기존 생성된 타겟과 병합되어 모수가 중복될 수 있습니다. 특별한 상황이 아니면 설정의 수정을 지양해주세요.</div>
    <div class="btn_wrap">
      <button class="before_btn close_pop" @click="clickCancel()">취소</button>
      <button class="next_btn" @click="createNeoTarget()" v-if="makeType === 'add'">타겟 만들기</button>
      <button class="delete_btn" @click="deleteNeoTarget()" v-if="makeType === 'modify'">삭제</button>
      <button class="next_btn" @click="updateNeoTarget()" v-if="makeType === 'modify'">타겟 수정하기</button>
    </div>
  </div>
</template>

<script>
import { numberFormatter } from '@/components/utils/Formatter'
import Select from '@/components/ui/Select'
import Dialog from '@/components/ui/Dialog'
import PartialLoading from '@/components/ui/PartialLoading'

export default {
  name: 'NeoTarget',

  components: {
    'ui-select': Select,
    'ui-dialog': Dialog,
    'ui-partial-loading': PartialLoading
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
    },

    scrollPop: {
      type: Function,
      default () {
        return false
      }
    }
  },

  computed:{
    selectAllNeoAccounts: {
      get () {
        let neoAccountKeys = Object.keys(this.neoAccounts)
        if (neoAccountKeys.length !== 0) {
          return this.neoAccounts ? this.selectedNeoAccounts.length === neoAccountKeys.length : false
        }
      },
      set (value) {
        let selected = []
        if (value) {
          this.checkFilterNeo('list-neoaccount', 'centeraccountid', 'neoAccounts', 'checkDataNeoAccounts')

          this.neoAccounts.forEach(function (item) {
            selected.push(item.centeraccountid)
          })
        }
        this.selectedNeoAccounts = selected
      }
    },

    selectAllNeoCampaigns: {
      get () {
        let neoCampaignKeys = Object.keys(this.neoCampaigns)
        if (neoCampaignKeys.length !== 0) {
          return this.neoCampaigns ? this.selectedNeoCampaigns.length === neoCampaignKeys.length : false
        }
      },
      set (value) {
        let selected = []
        if (value) {
          this.checkFilterNeo('list-neocampaign', 'campaignid', 'neoCampaigns', 'checkDataNeoCampaigns')

          this.neoCampaigns.forEach(function (item) {
            selected.push(item.campaignid)
          })
        }
        this.selectedNeoCampaigns = selected
      }
    },

    selectAllNeoKeywords: {
      get () {
        let neoKeywordKeys = Object.keys(this.neoKeywords)
        if (neoKeywordKeys.length !== 0) {
          return this.neoKeywords ? this.selectedNeoKeywords.length === neoKeywordKeys.length : false
        }
      },
      set (value) {
        let selected = []
        if (value) {
          this.checkFilterNeo('list-neokeyword', 'keywordid', 'neoKeywords', 'checkDataNeoKeywords')

          this.neoKeywords.forEach(function (item) {
            selected.push(item.keywordid)
          })
        }
        this.selectedNeoKeywords = selected
      }
    }
  },

  mounted () {
    this.$http.get('/neo_db/get_roi_report', {
      params: {
        'fb_ad_account_id': localStorage.getItem('fb_ad_account_id'),
        'type': 'account'
      }
    })
    .then(res => {
      const response = res.data
      const data = response.data
      const success = response.success
      if (success === 'YES') {
        // success
      } else {
        throw('success: ' + success)
      }
      return data
    })
    .then(data => {
      data.forEach(function(item, index) {
        item['count_formatter'] = numberFormatter(item['count'])
      })
      this.neoAccounts = data
      this.modifyNeoTargetType('media')
    })
    .catch(err => {
      console.error('/neo_db/get_roi_report type: account ', err)
    })

    this.$http.get('/neo_db/get_roi_report', {
      params: {
        'fb_ad_account_id': localStorage.getItem('fb_ad_account_id'),
        'type': 'campaign'
      }
    })
    .then(res => {
      const response = res.data
      const data = response.data
      const success = response.success
      if (success === 'YES') {
        // success
      } else {
        throw('success: ' + success)
      }
      return data
    })
    .then(data => {
      data.forEach(function(item, index) {
        item['count_formatter'] = numberFormatter(item['count'])
      })
      this.neoCampaigns = data
      this.modifyNeoTargetType('group')
    })
    .catch(err => {
      console.error('/neo_db/get_roi_report type: campaign ', err)
    })

    this.$http.get('/neo_db/get_roi_report', {
      params: {
        'fb_ad_account_id': localStorage.getItem('fb_ad_account_id'),
        'type': 'keyword'
      }
    })
    .then(res => {
      const response = res.data
      const data = response.data
      const success = response.success
      if (success === 'YES') {
        // success
      } else {
        throw('success: ' + success)
      }
      // 부분 로딩 삭제
      this.loadShow = false
      this.scrollPop()
      return data
    })
    .then(data => {
      data.forEach(function(item, index) {
        item['count_formatter'] = numberFormatter(item['count'])
      })
      this.neoKeywords = data
      this.modifyNeoTargetType('keyword')
    })
    .catch(err => {
      this.loadShow = false
      console.error('/neo_db/get_roi_report type: keyword', err)
    })

    this.modifyNeoTargetType('csv')
  },

  created () {
    this.$eventBus.$on('modifyNeoTarget', this.modifyNeoTarget)
  },

  beforeDestroy () {
    this.$eventBus.$off('modifyNeoTarget', this.modifyNeoTarget)
  },

  data () {
    return {
      collectionPeriod: 30,
      unvisitedPeriod: 0,
      targetName: '',
      neoTargetType: 'media',
      audienceSize: '-',
      isNumber: false,

      neoAccounts: [],
      neoCampaigns: [],
      neoKeywords: [],
      selectedNeoAccounts: [],
      selectedNeoCampaigns: [],
      selectedNeoKeywords: [],
      checkDataNeoAccounts: [],
      checkDataNeoCampaigns: [],
      checkDataNeoKeywords: [],
      addNeoAccounts:[],
      addNeoCampaigns:[],
      addNeoKeywords:[],

      uploadFile: '',

      subSelect: false,
      subInput: false,
      loadShow: true,

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

      wTab: {
        tab1: true,
        tab2: false,
        tab3: false,
        tab4: false,
        tab5: false,
        tab6: false
      },

      dialogShow:false,
      dialogData:{
        emptyText:'sample',
        type:'confirm',
        mode:'sample'
      },
      nextStage:false,

      csvItems: [],
      addCsvItems: [],

      accountSortClass: 'adv_asc',
      campaignSortClass: 'adv_asc',
      keywordSortClass: 'adv_asc',
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
        alert('수집 기간은 최소 1일입니다.')
        this.collectionPeriod = 1
      }
    },

    unvisitedPeriod (day) {
      if(day >= this.collectionPeriod) {
        alert('미방문 기간은 수집 기간보다 작아야합니다.')
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
    },

    accountSortClass (value) {
      // 정렬값에 따라 데이터를 변경 한다.
      if (value === 'adv_asc') {
        this.neoAccounts.sort(function(a, b) {
          if ( ! isNaN(a.advname) &&  ! isNaN(b.advname)  ) return a.advname - b.advname
          var a = a.advname.toString()
          var b = b.advname.toString()
          return ( a < b ) ? -1 : ( a == b ) ? 0 : 1
        })
      } else if (value === 'adv_desc') {
        this.neoAccounts.sort(function(a, b) {
          if ( ! isNaN(a.advname) &&  ! isNaN(b.advname)  ) return b.advname - a.advname
          var a = a.advname.toString()
          var b = b.advname.toString()
          return ( b < a ) ? -1 : ( b == a ) ? 0 : 1
        })
      } else if (value === 'account_asc') {
        this.neoAccounts.sort(function(a, b) {
          if ( ! isNaN(a.accountname) &&  ! isNaN(b.accountname)  ) return a.accountname - b.accountname
          var a = a.accountname.toString()
          var b = b.accountname.toString()
          return ( a < b ) ? -1 : ( a == b ) ? 0 : 1
        })
      } else if (value === 'account_desc') {
        this.neoAccounts.sort(function(a, b) {
          if ( ! isNaN(a.accountname) &&  ! isNaN(b.accountname)  ) return b.accountname - a.accountname
          var a = a.accountname.toString()
          var b = b.accountname.toString()
          return ( b < a ) ? -1 : ( b == a ) ? 0 : 1
        })
      } else if (value === 'conversion_asc') {
        this.neoAccounts.sort(function(a, b) {
          if ( ! isNaN(a.count) &&  ! isNaN(b.count)  ) return a.count - b.count
          var a = a.count.toString()
          var b = b.count.toString()
          return ( a < b ) ? -1 : ( a == b ) ? 0 : 1
        })
      } else if (value === 'conversion_desc') {
        this.neoAccounts.sort(function(a, b) {
          if ( ! isNaN(a.count) &&  ! isNaN(b.count)  ) return b.count - a.count
          var a = a.count.toString()
          var b = b.count.toString()
          return ( b < a ) ? -1 : ( b == a ) ? 0 : 1
        })
      }
    },

    campaignSortClass (value) {
      if (value === 'adv_asc') {
        this.neoCampaigns.sort(function(a, b) {
          if ( ! isNaN(a.advname) &&  ! isNaN(b.advname)  ) return a.advname - b.advname
          var a = a.advname.toString()
          var b = b.advname.toString()
          return ( a < b ) ? -1 : ( a == b ) ? 0 : 1
        })
      } else if (value === 'adv_desc') {
        this.neoCampaigns.sort(function(a, b) {
          if ( ! isNaN(a.advname) &&  ! isNaN(b.advname)  ) return b.advname - a.advname
          var a = a.advname.toString()
          var b = b.advname.toString()
          return ( b < a ) ? -1 : ( b == a ) ? 0 : 1
        })
      } else if (value === 'campaign_asc') {
        this.neoCampaigns.sort(function(a, b) {
          if ( ! isNaN(a.campaignname) &&  ! isNaN(b.campaignname)  ) return a.campaignname - b.campaignname
          var a = a.campaignname.toString()
          var b = b.campaignname.toString()
          return ( a < b ) ? -1 : ( a == b ) ? 0 : 1
        })
      } else if (value === 'campaign_desc') {
        this.neoCampaigns.sort(function(a, b) {
          if ( ! isNaN(a.campaignname) &&  ! isNaN(b.campaignname)  ) return b.campaignname - a.campaignname
          var a = a.campaignname.toString()
          var b = b.campaignname.toString()
          return ( b < a ) ? -1 : ( b == a ) ? 0 : 1
        })
      } else if (value === 'conversion_asc') {
        this.neoCampaigns.sort(function(a, b) {
          if ( ! isNaN(a.count) &&  ! isNaN(b.count)  ) return a.count - b.count
          var a = a.count.toString()
          var b = b.count.toString()
          return ( a < b ) ? -1 : ( a == b ) ? 0 : 1
        })
      } else if (value === 'conversion_desc') {
        this.neoCampaigns.sort(function(a, b) {
          if ( ! isNaN(a.count) &&  ! isNaN(b.count)  ) return b.count - a.count
          var a = a.count.toString()
          var b = b.count.toString()
          return ( b < a ) ? -1 : ( b == a ) ? 0 : 1
        })
      }
    },

    keywordSortClass (value) {
      if (value === 'adv_asc') {
        this.neoKeywords.sort(function(a, b) {
          if ( ! isNaN(a.advname) &&  ! isNaN(b.advname)  ) return a.advname - b.advname
          var a = a.advname.toString()
          var b = b.advname.toString()
          return ( a < b ) ? -1 : ( a == b ) ? 0 : 1
        })
      } else if (value === 'adv_desc') {
        this.neoKeywords.sort(function(a, b) {
          if ( ! isNaN(a.advname) &&  ! isNaN(b.advname)  ) return b.advname - a.advname
          var a = a.advname.toString()
          var b = b.advname.toString()
          return ( b < a ) ? -1 : ( b == a ) ? 0 : 1
        })
      } else if (value === 'keyword_asc') {
        this.neoKeywords.sort(function(a, b) {
          if ( ! isNaN(a.keywordname) &&  ! isNaN(b.keywordname)  ) return a.keywordname - b.keywordname
          var a = a.keywordname.toString()
          var b = b.keywordname.toString()
          return ( a < b ) ? -1 : ( a == b ) ? 0 : 1
        })
      } else if (value === 'keyword_desc') {
        this.neoKeywords.sort(function(a, b) {
          if ( ! isNaN(a.keywordname) &&  ! isNaN(b.keywordname)  ) return b.keywordname - a.keywordname
          var a = a.keywordname.toString()
          var b = b.keywordname.toString()
          return ( b < a ) ? -1 : ( b == a ) ? 0 : 1
        })
      } else if (value === 'conversion_asc') {
        this.neoKeywords.sort(function(a, b) {
          if ( ! isNaN(a.count) &&  ! isNaN(b.count)  ) return a.count - b.count
          var a = a.count.toString()
          var b = b.count.toString()
          return ( a < b ) ? -1 : ( a == b ) ? 0 : 1
        })
      } else if (value === 'conversion_desc') {
        this.neoKeywords.sort(function(a, b) {
          if ( ! isNaN(a.count) &&  ! isNaN(b.count)  ) return b.count - a.count
          var a = a.count.toString()
          var b = b.count.toString()
          return ( b < a ) ? -1 : ( b == a ) ? 0 : 1
        })
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

    onClickAccountSort (key) {
      // 호출이 완료 되었을때 정렬이 가능하게 한다.
      if (this.neoAccounts.length > 0) {
        // 좁은 공간이므로, 동일한 아이콘을 클릭한다면 같은 조건에 정렬을 반대로 설정
        if (key === this.accountSortClass) {
          if (key.indexOf('asc') > 0) {
            key = key.replace('asc', 'desc')
          } else {
            key = key.replace('desc', 'asc')
          }
        }
        this.accountSortClass = key
      }
    },
    onClickCampaignSort (key) {
      // 호출이 완료 되었을때 정렬이 가능하게 한다.
      if (this.neoCampaigns.length > 0) {
        // 좁은 공간이므로, 동일한 아이콘을 클릭한다면 같은 조건에 정렬을 반대로 설정
        if (key === this.campaignSortClass) {
          if (key.indexOf('asc') > 0) {
            key = key.replace('asc', 'desc')
          } else {
            key = key.replace('desc', 'asc')
          }
        }
        this.campaignSortClass = key
      }
    },
    onClickKeywordSort (key) {
      // 호출이 완료 되었을때 정렬이 가능하게 한다.
      if (this.neoKeywords.length > 0) {
        // 좁은 공간이므로, 동일한 아이콘을 클릭한다면 같은 조건에 정렬을 반대로 설정
        if (key === this.keywordSortClass) {
          if (key.indexOf('asc') > 0) {
            key = key.replace('asc', 'desc')
          } else {
            key = key.replace('desc', 'asc')
          }
        }
        this.keywordSortClass = key
      }
    },
    dialogOpen (emptyText, type, mode) {
      this.dialogData['emptyText'] = emptyText
      this.dialogData['type'] = type
      this.dialogData['mode'] = mode
      this.dialogShow = true;
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

      if(mode == 'createNeoTarget') {
        // Create Target -----------------------------------------------------------------
        let params = {
          fb_ad_account_id: localStorage.getItem('fb_ad_account_id'),
          target_type: 'neo_target',
          pixel_id: this.findSelectKey('adAccountPixels'),
          name: this.targetName,
          retention_days: this.collectionPeriod,
          exclusion_retention_days: this.unvisitedPeriod,
          neo_type: this.neoTargetType,

          detail: this.findSelectKey('selectCustomer'),
          input_percent: this.findSelectKey('selectSub'),

          // v1.2 추가내용 시작 (파라메터 생성)
          inclusions: this.makeInclusions(),
          exclusions: this.makeExclusions()
          // v1.2 추가내용 끝 (파라메터 생성)
        }

        if (this.neoTargetType === 'media') {
          params['keywords'] = this.findSelectedNeoKey('addNeoAccounts', 'accountname')
          params['neo_ids'] = this.findSelectedNeoKey('addNeoAccounts', 'param')
        } else if (this.neoTargetType === 'group') {
          params['keywords'] = this.findSelectedNeoKey('addNeoCampaigns', 'campaignname')
          params['neo_ids'] = this.findSelectedNeoKey('addNeoCampaigns', 'param')
        } else if (this.neoTargetType === 'keyword') {
          params['keywords'] = this.findSelectedNeoKey('addNeoKeywords', 'keywordname')
          params['neo_ids'] = this.findSelectedNeoKey('addNeoKeywords', 'param')
        } else if (this.neoTargetType === 'csv') {
          params['keywords'] = this.findSelectedNeoKey('addCsvItems', 'name')
          params['neo_ids'] = this.findSelectedNeoKey('addCsvItems', 'name')
        } else {
          console.log('this.neoTargetType', this.neoTargetType)
          return
        }

        this.$http.post('/pickdata_account_target/custom_target', params)
        .then((response) => {
          var success = response.data.success
          if (success == "YES") {
            // success
            this.$eventBus.$emit('getAccountTarget')
          } else {
            // 컨펌,얼럿 텍스트 - 메세지창 타입(confirm,alert) - 독립적모드이름(alert 메세지시 사용 X)
            this.dialogOpen('NEO 타겟 생성 실패', 'alert')
            throw('success: ' + success)
          }
          this.$emit('close')
        })
        .catch(err => {
          this.$emit('close')
          console.log('/pickdata_account_target/custom_target: ', err)
        })

      } else if (mode === 'deleteNeoTarget') {
        // Delete Target -----------------------------------------------------------------
        this.$emit('deleteCustomTarget', this.makeItem.id)

      } else if (mode === 'updateNeoTarget') {
        // Update Target -----------------------------------------------------------------
        let params = {
          pickdata_account_target_id: this.makeItem.id,
          fb_ad_account_id: localStorage.getItem('fb_ad_account_id'),
          target_type: 'neo_target',
          pixel_id: this.findSelectKey('adAccountPixels'),
          name: this.targetName,
          retention_days: this.collectionPeriod,
          exclusion_retention_days: this.unvisitedPeriod,
          neo_type: this.neoTargetType,

          detail: this.findSelectKey('selectCustomer'),
          input_percent: this.findSelectKey('selectSub'),

          // v1.2 추가내용 시작 (파라메터 생성)
          inclusions: this.makeInclusions(),
          exclusions: this.makeExclusions()
          // v1.2 추가내용 끝 (파라메터 생성)
        }

        if (this.neoTargetType === 'media') {
          params['keywords'] = this.findSelectedNeoKey('addNeoAccounts', 'accountname')
          params['neo_ids'] = this.findSelectedNeoKey('addNeoAccounts', 'param')
        } else if (this.neoTargetType === 'group') {
          params['keywords'] = this.findSelectedNeoKey('addNeoCampaigns', 'campaignname')
          params['neo_ids'] = this.findSelectedNeoKey('addNeoCampaigns', 'param')
        } else if (this.neoTargetType === 'keyword') {
          params['keywords'] = this.findSelectedNeoKey('addNeoKeywords', 'keywordname')
          params['neo_ids'] = this.findSelectedNeoKey('addNeoKeywords', 'param')
        } else if (this.neoTargetType === 'csv') {
          params['keywords'] = this.findSelectedNeoKey('addCsvItems', 'name')
          params['neo_ids'] = this.findSelectedNeoKey('addCsvItems', 'name')
        } else {
          console.log('this.neoTargetType', this.neoTargetType)
          return
        }

        this.$http.put('/pickdata_account_target/custom_target', params)
        .then((response) => {
          var success = response.data.success
          if (success == "YES") {
            // success
            this.$eventBus.$emit('getAccountTarget')
          } else {
            this.dialogOpen('NEO  타겟 수정 실패', 'alert')
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
      this.dialogShow = false;
    },

    // 다이얼로그 취소 클릭시
    dialogCancel() {
      this.nextStage = false;
      this.dialogShow = false;
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
      /*
      Select Text 가져오기
      */
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

    findSelectedNeoKey (listName, key) {
      let result = []
      const data = this[listName]
      data.forEach(function (item, index) {
        result.push(item[key])
      })
      return result
    },

    checkListNeo (elId, uniqueKey, mainListName, checkListName, addListName, selectedListName) {
      /*
      체크 된 리스트 옮기기
      (element-id, uniqueKey, 원본 리스트 저장변수, 체크된 리스트 저장변수, 옮겨진 리스트 저장변수, 선택된 리스트 저장변수)
      checkListNeo('list-neoaccount', 'centeraccountid', 'neoAccounts', 'checkDataNeoAccounts', 'addNeoAccounts', 'selectedNeoAccounts')
      */
      const me = this
      this.checkFilterNeo(elId, uniqueKey, mainListName, checkListName)

      this[addListName] = this[addListName].concat(this[checkListName])
      this[checkListName].forEach(function(value, index) {
        me[mainListName] = me[mainListName].filter(function(item) {
          return item !== value
        })
      })

      this[selectedListName] = []
      this[checkListName] = []
    },

    checkFilterNeo (elId, uniqueKey, mainListName, checkListName) {
      /*
      체크 된 리스트 저장하기
      (element-id, uniqueKey, 원본 리스트 저장변수, 체크된 리스트 저장변수)
      */
      let ul = document.getElementById(elId)
      let items = ul.getElementsByTagName("li")
      let itemsData = this[mainListName]

      for (let i = 0; i < items.length; i++) {
        let checkBox = items[i].getElementsByTagName('input')[0].checked
        if(checkBox == true) {
          let checkItemsId = items[i].getElementsByTagName('input')[0].getAttribute('data-id')
          for(let idx = 0; idx < itemsData.length ; idx++) {
            if(checkItemsId == itemsData[idx][uniqueKey]) {
              this[checkListName].push(itemsData[idx])
            }
          }
        }
      }
    },

    deleteListNeo (elId, mainListName, addListName, item) {
      /*
      선택된 리스트에서 삭제하기
      (element-id, 원본 리스트 저장변수, 옮겨진 리스트 저장변수, item Object)
      deleteListNeo('add-list-neoaccount', 'neoAccounts', 'addNeoAccounts', item)
      */
      const checkAdd = this[addListName]
      const addListEl = document.getElementById(elId)
      const addlistLi = addListEl.getElementsByTagName('li')
      if(item === 'all') {
        for(let i = 0; i < addlistLi.length; i++) {
          this[mainListName].push(checkAdd[i])
        }
        this[addListName].splice(0, addlistLi.length)
      }else{
        this[addListName].splice(this[addListName].indexOf(item), 1)
        this[mainListName].push(item)
      }
    },

    // Create Target Dialog
    createNeoTarget () {
      if (this.collectionPeriod.length === 0) {
        this.dialogOpen('수집 기간을 입력해주세요.', 'alert')
      } else if (this.unvisitedPeriod.length === 0) {
        this.dialogOpen('미방문 기간을 입력해주세요.', 'alert')
      } else if (this.targetName.length === 0) {
        this.dialogOpen('타겟 이름을 입력해주세요.', 'alert')
      } else {
        this.dialogOpen('입력한 내용으로 타겟을 생성하시겠습니까?', 'confirm', 'createNeoTarget')
      }
    },

    // Delete Target Dialog
    deleteNeoTarget () {
      this.dialogOpen('삭제하시겠습니까?', 'confirm', 'deleteNeoTarget')
    },

    // Update Target Dialog
    updateNeoTarget () {
      if (this.collectionPeriod.length === 0) {
        this.dialogOpen('수집 기간을 입력해주세요.', 'alert')
      } else if (this.unvisitedPeriod.length === 0) {
        this.dialogOpen('미방문 기간을 입력해주세요.', 'alert')
      } else if (this.targetName.length === 0) {
        this.dialogOpen('타겟 이름을 입력해주세요.', 'alert')
      } else {
        this.dialogOpen('수정하시겠습니까?', 'confirm', 'updateNeoTarget')
      }
    },

    // TODO 제거 또는 변경 필요
    deleteAddCsvItems(item) {
      const checkAdd = this.addCsvItems
      const addListEl = document.getElementById('add-list-csv')
      const addlistLi = addListEl.getElementsByTagName('li')
      if(item === 'all') {
        for(let i = 0; i < addlistLi.length; i++) {
          this.csvItems.push(checkAdd[i])
        }
        this.addCsvItems.splice(0, addlistLi.length)
      }else{
        this.addCsvItems.splice(this.addCsvItems.indexOf(item), 1)
        this.csvItems.push(item)
      }
    },

    modifyNeoTargetType (type) {
      const me = this
      if (this.makeType === 'modify') {
        const description = this.makeItem.description
        const params = description.params

        if (type === params.neo_type) {
          let modifyData = []
          let checkedData = []
          let neoType = params.neo_type
          let neoIds = params.neo_ids
          neoIds = Array.from(new Set(neoIds))

          this.neoTargetType = neoType
          if (neoType == 'media') {
            this.wTabs(0,'wTab')
            modifyData = this.neoAccounts
          } else if (neoType == 'group') {
            this.wTabs(1,'wTab')
            modifyData = this.neoCampaigns
          } else if (neoType == 'keyword') {
            this.wTabs(2,'wTab')
            modifyData = this.neoKeywords
          } else if (neoType == 'csv') {
            this.wTabs(3,'wTab')
          }

          neoIds.forEach(function (item, index) {
            modifyData.forEach(function (neoItem, i) {
              if (item === neoItem['param']) {
                checkedData.push(neoItem)
              }
            })
          })

          if (neoType === 'media') {
            this.checkDataNeoAccounts = checkedData
            setTimeout(function() {
              me.checkListNeo('list-neoaccount', 'centeraccountid', 'neoAccounts', 'checkDataNeoAccounts', 'addNeoAccounts', 'selectedNeoAccounts')
            }, 100)
          } else if (neoType === 'group') {
            this.checkDataNeoCampaigns = checkedData
            setTimeout(function() {
              me.checkListNeo('list-neocampaign', 'campaignid', 'neoCampaigns', 'checkDataNeoCampaigns', 'addNeoCampaigns', 'selectedNeoCampaigns')
            }, 100)
          } else if (neoType === 'keyword') {
            this.checkDataNeoKeywords = checkedData
            // this.checkFilterNeo('list-neokeyword', 'keywordid', 'neoKeywords', 'checkDataNeoKeywords')
            setTimeout(function() {
              me.checkListNeo('list-neokeyword', 'keywordid', 'neoKeywords', 'checkDataNeoKeywords', 'addNeoKeywords', 'selectedNeoKeywords')
            }, 100)

          } else if (neoType === 'csv') {
            let ekamsData = []
            neoIds.forEach(function (item, index) {
              ekamsData.push({
                id: index,
                name: item
              })
            })
            this.addCsvItems = ekamsData
          }
        }
      }
    },

    modifyNeoTarget () {
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
      this.adAccountPixels.emptyText = this.findSelectText('adAccountPixels', this.makeItem.description.params.pixel_id)

      // 수집 기간
      this.collectionPeriod = numberFormatter(this.makeItem.description.retention_days)

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
      if (detail === 'total') {
        // 전체 고객
        this.selectCustomer.emptyText = '전체 고객'
      } else if (detail === 'usage_time_top') {
        // 이용 시간 상위 고객
        this.selectCustomer.emptyText = '이용 시간 상위 고객'
        this.selectSub.emptyText = params.input_percent + '%'
        this.subSelect = true
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
      } else {
        console.log('nothing..', detail)
      }
    },

    downloadTemplate () {
      window.open('/pickdata_account_target/neo_custom_target', '_blank')
    },

    uploadTemplate (event) {
      this.uploadFile = event.target.files[0]
    },

    upoloadNeoTargetFile () {
      let data = new FormData()
      data.append('fb_ad_account_id', localStorage.getItem('fb_ad_account_id'))
      data.append('upload_file', this.uploadFile)
      let config = {
        onUploadProgress: function(progressEvent) {
          let percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
        }
      };

      if (this.uploadFile == '') {
        this.dialogOpen('업로드 파일이 없습니다.', 'alert')
        return
      }

      this.$http.post('/pickdata_account_target/neo_custom_target', data, config)
      .then((response) => {
        const success = response.data.success
        if (success == "YES") {
          const data = response.data.data
          // success
          this.dialogOpen('파일 업로드를 완료했습니다.', 'alert')
          this.addCsvItems = data
        } else {
          throw('success: ' + success)
        }
      })
      .catch(err => {
        // this.$emit('close')
        this.dialogOpen('파일 업로드에 실패했습니다.', 'alert')
        console.log('/pickdata_account_target/neo_custom_target: ', err)
      })
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
.Spinner{margin:85px auto!important;}
.target_inner_tbody{padding:0px!important; border:0px!important;
}
</style>
