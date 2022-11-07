<template>
  <div class="list">
    <h2 class="title">List2</h2>
    <template v-if="errored"> <!-- axios catch error 일 시 노출 -->
      <p class="errored">죄송합니다. 현재 이 정보를 검색할 수 없습니다. <br />나중에 다시 시도해 주세요.</p>
    </template>
    <template v-else> <!-- axios catch error 없을 시 노출 -->
      <div class="search">
        <input type="text" v-model="search" placeholder="검색어를 입력하세요"> <!--검색어 v-model에 바인딩 -->
        <button class="btn_search" @click="fnSearch"> <!-- 검색 버튼 클릭 시 fnSearch 함수로 검색 실행 -->
          <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg> <!-- SVG 검색 아이콘 이미지 -->
        </button>
      </div>
      <template v-if="loading"> <!-- lists 데이터 불러오기 전 로딩 아이콘 출력 -->
        <p class="loading">
          <svg class="spinner" viewBox="0 0 50 50"> <!-- SVG 로딩 아이콘 이미지 -->
            <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
          </svg>
        </p>
      </template>
      <!-- axios 데이터 로드 후 데이터 있을 시(lists.length) 또는 검색 된 데이터가 없을 시(searchNoData) 노출 -->
      <template v-else-if="lists.length || searchNoData"> 
        <ul v-if="lists.length"> <!-- axios 데이터 로드 후 데이터 있을 시(lists.length) -->
          <li v-for="(list, index) in lists" :key="list.id">  <!-- lists 데이터의 각각 list와 index 설정 -->
            <router-link :to="{ name:'Detail2', params: { id: list.id }}"> <!-- 게시글 클릭 시 Detail2 페이지로 이동 -->
              <span class="id">{{ (total - index) - ((page - 1) * limit) }}</span> <!-- 글 no. 역순 -->
              <span class="category">{{ list.category }}</span>
              <span class="title">{{ list.title }}</span>
              <span class="delete"><button @click.prevent="fnDelete(list, index)"><span>삭제</span></button></span> <!-- 글 삭제 -->
            </router-link>
          </li>
        </ul>
        <p v-else class="nodata">검색된 데이터가 없습니다.</p> <!--검색 된 데이터가 없을 시(searchNoData) 노출 -->
      </template>
      <template v-else> <!-- json 파일에 등록된 게시물이 없을 시 노출 -->
        <p class="nodata">등록된 게시글이 없습니다.</p>
      </template>
    </template>
    <!-- Vue.js(v3) 페이징 components(props로 설정) : https://www.npmjs.com/package/vuejs-paginate-next -->
    <!-- v-model="page" 선택된 현재 페이지 v-model로 동적으로 할당 -->
    <!-- page-count : 총 페이징 갯수 -->
    <!-- page-range : 한 페이지에 노출 될 페이징 수 -->
    <!-- margin-pages : 마지막 페이지 표시 (... 이후) -->
    <!-- click-handler : 페이지를 클릭할 때 호출할 메서드, 클릭한 페이지 번호를 매개변수로 사용 -->
    <!-- prev-text : 이전 버튼 html 설정 -->
    <!-- next-text : 다음 버튼 html 설정 -->
    <!-- first-button-text : 처음 버튼 html 설정 -->
    <!-- last-button-text : 마지막 버튼 html 설정 -->
    <!-- container-class : 컨테이너 class 설정 -->
    <!-- page-class : 각 페이징 버튼 class 설정 -->
    <!-- break-view-link-class : ... break disabled class 설정 -->
    <paginate
      v-model="page" 
      :page-count="pageCount"
      :page-range="4"
      :margin-pages="0"
      :click-handler="clickCallback"
      :prev-text="'‹'"
      :next-text="'›'"
      :first-button-text="'«'"
      :last-button-text="'»'"
      :first-last-button="true"
      :container-class="'pagination'"
      :page-class="'page-item'"
      :break-view-link-class="'break-view'"
    >
    </paginate>
    <div class="btn_center">
        <router-link to="/list2/write" class="btn_basic">글쓰기</router-link>
      </div>
  </div>
</template>

<script>
import Paginate from "vuejs-paginate-next" // paginate components import
export default {
  components: { Paginate }, // paginate components 등록
  data() {
    return {
      lists: [], // res.data 넣을 데이터
      total: '', // res.data 데이터 총 갯수 데이터
      search: '', // v-model="search" 데이터
      errored: false, // axios catch error 체크 데이터
      loading: true, // lists 데이터 불러오기 전 로딩
      searchValue : '', // v-model="search"의 양방향 데이터를 넣을 데이터
      searchNoData : false, // 검색어는 있는데 검색된 데이터가 없을 시 true
      page: 1, // 선택된 현재 페이지
      pageCount: 0, // 총 페이징 갯수
      limit: 5 // 페이지에 노출 될 게시물 갯수
    }
  },
  mounted() {
    this.fnGetList()  // mounted 시 fnGetList (axios get) 함수 실행
  },
  methods: {
    fnGetList() {
      // params 객체 : 라우터 주소 이동 시 parameter 값을 넘김 (내부만 가능, 외부에서 들어올 시는 query 사용 )
      // this.$axios.get(this.baseURL + '/lists')
      // this.$axios.get(this.baseURL + '/lists?_sort=id&_order=desc&_page=1&_limit=8')
      this.$axios.get(this.baseURL + '/lists', {
          params: { // json-server 참조 : https://www.npmjs.com/package/json-server
            _sort: 'id', // id 기준으로 정렬
            _order: 'desc', // desc : 내림차순, asc : 오름차순
            _page: this.page, // 선택된 현재 페이지 매김
            _limit: this.limit, // 페이지에 노출 될 게시물 갯수
            q: this.searchValue !== '' ? this.searchValue : '' // q : Full-text search / 검색어 있다면 searchValue, 없다면 빈값으로 설정
            // title_like: this.search,
            // contents_like: this.search,
            // q: this.search
            // q: type == 'search'? this.search : ''
            // q: this.search != '' ? this.search : '' // q: this.search
          }
        })
        .then(res => {
          this.lists = res.data // res.data 데이터 lists 데이터에 넣어 출력
          this.total = res.headers['x-total-count'] // x-total-count : data의 총 갯수
          this.pageCount = Math.ceil(this.total / this.limit) // 총갯수 나누기 노출 될 갯수를 Math.ceil로 소수값 버리고 올림
          console.log(this.total)
          this.loading = false // res.data 데이터 불러온 후 로딩 비노출
          if(!res.data.length && this.searchValue !== '') { // 검색어는 있는데 데이터가 없다면
            this.searchNoData = true // 검색된 데이터가 없습니다 출력
          }
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
    },
    clickCallback() { // click-handler="clickCallback" 페이징 클릭 시 
      this.fnGetList() // params 조건의 데이터를 불러와 출력
    },
    fnSearch() { // 검색 버튼 클릭 시 검색 함수 실행
      this.searchValue = this.search // searchValue 데이터에 input의 v-model="search" 데이터 넣음
      if(this.searchValue !== '') { // searchValue 데이터가 있을 시
        this.page = 1 // 1페이지로 이동
        this.fnGetList() // fnGetList (axios get) 함수 실행, 리스트 받아와 출력
      } else { // searchValue 데이터가 없을 시 (검색어 입력 안하고 검색 버튼 클릭 시)
        alert ('검색어를 입력해 주세요.') // 검색어 입력해 주세요. alert 실행
      }
    }
  }
}
</script>

<style scoped>
.search {position:relative}
.search input[type=text] {width:100%;margin-bottom:30px;}
.btn_search {position:absolute;top:0;right:0;width:44px;height:44px;background:none;border:0 none;cursor:pointer}
.btn_search svg {width:24px;height:24px;margin:10px 0 0 0;opacity:.8;fill:white}
.btn_search svg:hover {fill:#58e4a5}
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