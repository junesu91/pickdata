<template>
  <div class="terms_wrap">
    <button type="button" v-if="terms_add === false" @click="terms_add = true">+ 조건추가</button>
    <button type="button" v-if="terms_delete === false" @click="terms_delete = true">- 조건제외</button>
  </div>
  <!-- 조건 추가 경우 -->
  <div class="account_info add_info" v-if="terms_add">
    <div class="account_title">중</div>
    <div>
      <ui-select></ui-select>
    </div>
    <div class="terms_wrap">
      <button type="button" @click="terms_add = false">- 삭제</button>
    </div>
  </div>
  <!-- // 조건 추가 경우 -->
  <!-- 조건 제외 경우 -->
  <div class="account_info add_info" v-if="terms_delete">
    <div class="account_title">에서</div>
    <div>
      <ui-select></ui-select>
      <span class="except_title">제외</span>
    </div>
    <div class="terms_wrap">
      <button type="button" @click="terms_delete = false">- 삭제</button>
    </div>
  </div>
  <!-- // 조건 제외 경우 -->
</template>

<script>
import Select from '@/components/ui/Select'

export default {
  name : 'TermsSelect',
  components : {
    'ui-select': Select
  },
  data () {
    return {
      terms_add : false,
      terms_delete : false
    }
  }
}
</script>

<style lang="css" scoped>
</style>
