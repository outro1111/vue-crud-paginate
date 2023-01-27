<template>
  <div class="detail">
    <template v-if="errored"> <!-- axios catch error 일 시 노출 -->
      <p class="errored">죄송합니다. 현재 이 정보를 검색할 수 없습니다. <br />나중에 다시 시도해 주세요.</p>
    </template>
    <template v-else> <!-- axios catch error 없을 시 노출 -->
      <template v-if="list"> <!-- axios 데이터 로드 후 데이터 있을 시 노출 -->
        <h2 class="title"><span class="category">{{ list.category }}</span> {{ list.title }}</h2>
        <p class="contents"><pre>{{ list.contents }}</pre></p>
        <div class="btn_center">
          <button class="btn_basic" @click.prevent="fnDelete">삭제</button>
          <button class="btn_basic" @click.prevent="fnUpdate">수정</button>
          <router-link to="/list2" class="btn_basic">목록</router-link>
        </div>
      </template>
      <p class="loading" v-else> <!-- lists 데이터 없을 시 로딩 아이콘 출력 -->
        <svg class="spinner" viewBox="0 0 50 50">
          <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
        </svg>
      </p>
    </template>
  </div>
</template>

<script>
export default {
  props: ['id'], // router index.js에서 /list/:id 로 전달한 params의 id를 props로 전달 받음
  data() {
    return {
      // id를 props로 전달 받지 않을 시 아래와 같이 사용
      // id: this.$route.params.id,
      list: null, // 최초 list detail 데이터는 null 값으로 셋팅
      errored: false // axios catch error 체크 데이터
    }
  },
  mounted() {
    this.fnGetDetail() // mounted 시 fnGetDetail (axios get) 함수 실행
  },
  methods: {
    fnGetDetail() {
      this.$axios.get(this.baseURL + '/lists/' + this.id) // 해당 id를 path에 넣어 detail 데이터 불러옴
      .then(res => {
        console.log(res.data)
        this.list = res.data // res.data를 list 데이터에 넣어 출력
      })
      .catch(error => {
        console.log('에러', error)
        this.errored = true // 에러 일 시 true
      })
    },
    fnDelete() { // 해당 게시물 삭제
      if(confirm('삭제하시겠습니까?')) { // comfirm 창 먼저 실행 - 확인 시 밑 소스 실행
        this.$axios.delete(this.baseURL + '/lists/' + this.id) // axios delete 로 해당(id) 게시물 삭제
        .then(() => {
           this.$router.push({ path: '/list2' }) // 삭제 후 리스트 페이지로 이동
          })
      }
    },
    fnUpdate() {
      this.$router.push({ // 수정 버튼 클릭 시 Write 페이지로 이동
        name: 'Write2',
        params: { id: this.id } // Write 이동 시 url path에 params로 id 전달
      })
    }
  }
}
</script>

<style scoped>
.detail {text-align:center;margin:80px 0 40px}
.detail .category {display:inline-block;margin-top:8px;padding:2px 15px;font-size:14px;vertical-align:top;background:rgba( 0, 0, 0, 0.15)}
.detail .title {font-weight:300}
.detail .contents {margin:50px 0;font-weight:300}
.detail .contents pre {white-space:pre-line;}
</style>
