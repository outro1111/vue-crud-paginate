<template>
  <div id="wrap">
    <AppHeader :forceRerender="forceRerender" /> <!-- AppHeader.vue 자식에게 함수를 props로 전달 -->
    <div id="content">
      <router-view :key="componentKey" /> <!-- List2 페이지 강제 rerender를 위한 key  -->
    </div>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
export default {
  components: { AppHeader, AppFooter },
   data() {
    return {
      componentKey: 0 // List2 페이지 강제 rerender를 위한 데이터
    }
  },
  methods: {
    // List2 페이지는 페이징과 검색 기능이 있어 메뉴를 다시 눌렀을 시 초기화 필요
    forceRerender() { // AppHeader.vue 내부 List2 링크에서 클릭 할 함수
      this.componentKey += 1 // List2 링크 클릭 할 때 마다 key 값을 변경 / 변화를 감지하여 강제 렌더링
    }
  }
}
</script>

<style>

</style>
