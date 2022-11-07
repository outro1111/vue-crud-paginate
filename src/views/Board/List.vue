<template>
  <div class="list">
    <h2 class="title">List</h2>
    <template v-if="errored"> <!-- axios catch error 일 시 노출 -->
      <p class="errored">죄송합니다. 현재 이 정보를 검색할 수 없습니다. <br />나중에 다시 시도해 주세요.</p>
    </template>
    <template v-else> <!-- axios catch error 없을 시 노출 -->
      <input type="text" v-model="search" class="search" placeholder="검색어를 입력하세요"> <!--검색어 v-model에 바인딩 -->
      <template v-if="loading"> <!-- lists 데이터 불러오기 전 로딩 아이콘 출력 -->
        <p class="loading">
          <svg class="spinner" viewBox="0 0 50 50"> <!-- SVG 로딩 아이콘 이미지 -->
            <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
          </svg>
        </p>
      </template>
      <template v-else-if="lists.length"> <!-- axios 데이터 로드 후 데이터 있을 시 노출 -->
        <ul v-if="filterLists.length"> <!-- lists 데이터를 필터링 하여 데이터 있을 시 노출 -->
          <li v-for="(list, index) in filterLists" :key="list.id"> <!-- filterLists 데이터의 각각 list와 index 설정 -->
            <router-link :to="{ name:'Detail', params: { id: list.id }}"> <!-- Detail 페이지로 이동 / id를 params로 넘김 -->
            <!-- <router-link :to="'/list/' + list.id"> -->
              <span class="id">{{ total - index }}</span> <!-- 전체 갯수에서 index 삐기 / 순번 역순으로 출력 -->
              <span class="category">{{ list.category }}</span> <!-- 데이터의 category 출력 -->
              <span class="title">{{ list.title }}</span> <!-- 데이터의 title 출력 -->
              <!-- fnDelete 함수로 해당 게시물 삭제 / prevent 요소의 클릭 기본 이벤트 막고, 지정한 메소드로 이벤트 핸들링 수행 -->
              <span class="delete"><button @click.prevent="fnDelete(list, index)"><span>삭제</span></button></span>
            </router-link>
          </li>
        </ul>
        <p v-else class="nodata">검색된 데이터가 없습니다.</p> <!-- filterLists 검색 된 데이터 없을 시 출력 -->
      </template>
      <template v-else> <!-- lists 데이터 없을 시 로딩 아이콘 출력 -->
        <p class="nodata">등록된 게시글이 없습니다.</p>
      </template>
    </template>
    <div class="btn_center">
        <router-link to="/list/write" class="btn_basic">글쓰기</router-link> <!-- 클릭 시 Write 페이지로 이동 -->
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lists: [], // res.data 넣을 데이터
      total: '', // res.data.length 데이터 총 갯수 데이터
      search: '', // v-model="search" 데이터
      errored: false, // axios catch error 체크 데이터
      loading: true // lists 데이터 불러오기 전 로딩
    }
  },
  mounted() {
    this.fnGetList() // mounted 시 fnGetList (axios get) 함수 실행
  },
  methods: {
    fnGetList() {
      this.$axios.get(this.baseURL + '/lists')
        .then(res => {
          this.lists = res.data.reverse() // res.data 데이터 역순으로 lists 데이터에 넣어 출력
          this.total = res.data.length // 데이터 총 갯수
          this.loading = false
          console.log(res.data)
        })
        .catch(error => {
          console.log('에러', error)
          this.errored = true // 에러 일 시 true
        })
    },
    fnDelete(list, index) { // 삭제 버튼 클릭 시 실행 파라미터로 list, index 받아옴
      console.log(list, index)
      if (confirm('삭제하시겠습니까?')) { // comfirm 창 먼저 실행 - 확인 시 밑 소스 실행
        this.$axios.delete(this.baseURL + '/lists/' + list.id) // axios delete 로 해상(id) 게시물 삭제
        .then(() => {
            this.fnGetList() // 삭제 후 리스트 다시 받아와 출력
          })
      }
    }
  },
  computed: {
    filterLists() {
      return this.lists.filter((list) => {
        // 정규표현식 (Regular Expression) / i (Flag)는 대소문자를 구별하지 않고 검색
        return list.title.match(new RegExp(this.search, 'i')) || list.contents.match(new RegExp(this.search, 'i'))
      })
    }
  }
}
</script>

<style scoped>
.search {width:100%;margin-bottom:30px;}
.list {margin:0 0 50px}
.list li {border-bottom:1px solid rgba( 255, 255, 255, 0.4)}
.list li:first-child {border-top:1px solid rgba( 255, 255, 255, 0.4)}
.list li a {display:flex;align-items:center;padding:15px 15px 15px 0;transition:background-color .4s ease;}
.list li a:hover {background:rgba( 255, 255, 255, 0.1)}
.list li .id {width:10%;text-align:center}
.list li .category {width:10%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.list li .title {width:75%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.list li .delete {width:5%;text-align:center}
.list li .delete button {display:inline-block;width:20px;height:20px;padding:0;background:linear-gradient(-45deg, transparent 0%, transparent 48%, white 46%,  white 54%,transparent 54%, transparent 100%), linear-gradient(45deg, transparent 0%, transparent 48%, white 46%,  white 54%,transparent 54%, transparent 100%);border:0 none;border-radius:100%;cursor:pointer;opacity:.6;vertical-align:middle}
.list li .delete button:hover {opacity:1;background:linear-gradient(-45deg, transparent 0%, transparent 48%, #58e4a5 46%,  #58e4a5 54%,transparent 54%, transparent 100%), linear-gradient(45deg, transparent 0%, transparent 48%, #58e4a5 46%,  #58e4a5 54%,transparent 54%, transparent 100%)}
.list li .delete span {display:none}
.errored, .loading, .nodata {text-align:center;padding:20px 0;min-height:300px;opacity:.7}
</style>