<template>
  <div class="write">
    <h2 class="title">List</h2>
    <form>
      <div class="row">
        <label for="title">제목</label>
        <!-- ref : 컴포넌트 또는 DOM에 접근하기 위해 사용하는 속성 / title 이름을 가진 input에 접근 가능 -->
        <input type="text" id="title" v-model="list.title" ref="title" />
      </div>
      <div class="row">
        <label for="contents">내용</label>
        <textarea id="contents" cols="30" rows="10" v-model="list.contents" ref="contents"></textarea>
      </div>
      <div class="row">
        <label for="category">카테고리</label>
        <select id="category" v-model="list.category" ref="category">
          <option value="" disabled>선택하세요</option>
          <option v-for="category in categories" :key="category">{{ category }}</option>
        </select>
      </div>
      <div class="btn_center">
        <button class="btn_basic" @click.prevent="fnSave">확인</button>
        <router-link to="/list2" class="btn_basic">취소</router-link>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: ['id'],
  data() {
    return {
      list: {
        title: '',
        contents: '',
        category: '',
      },
      categories: ['뉴스', '스포츠', '영화', '음악']
    }
  },
  mounted() {
    this.fnGetView() // mounted 시 fnGetView (axios get) 함수 실행
  },
  methods: {
    fnGetView() { // 글 수정 : id에 해당하는 데이터 블러옴
      console.log(this.id)
      if (this.id) { // 글쓰기 수정버튼으로 들어와 id가 있는 경우
        this.$axios.get(this.baseURL + '/lists/' + this.id)
        .then(res => {
          console.log(res.data)
          this.list = res.data // res.data를 list 데이터에 넣어 input에 출력
          // this.list.title = res.data.title
          // this.list.contents = res.data.contents
          // this.list.category = res.data.category
        })
        .catch(error => {
          console.log('에러', error)
        })
      }
    },
    fnSave() { // 글 등록
      if (!this.list.title) { // validation 체크 : 제목 input에 입력 값 없을 경우
        alert('제목을 입력해 주세요.') // alert 먼저 실행 - 확인 시 밑 소스 실행
        this.$refs.title.focus() // title이라는 ref 요소 input으로 포커스 이동
        return
      } 
      if (!this.list.contents) {
        alert('내용을 입력해 주세요.')
        this.$refs.contents.focus() // contents라는 ref 요소 textarea로 포커스 이동
        return
      }
      if (!this.list.category) {
        alert('카테고리를 선택하세요.')
        this.$refs.category.focus() // category라는 ref 요소 select로 포커스 이동
        return
      }
      if (this.id) { // 글 수정 등록 : id가 있을 시 axios put 메소드로 수정, .put(주소, 데이터)
        this.$axios.put(this.baseURL + '/lists/' + this.id, this.list)
          .then(() => {
            this.$router.push({ path: '/list2/' }) // 수정 후 list2 페이지로 이동
          })
          .catch(error => {
            console.log('에러', error)
          })
      } else { // 글 신규 등록 : id가 없을 시 axios post 메소드로 신규 등록, .post(주소, 데이터)
        this.$axios.post(this.baseURL + '/lists/', this.list)
          .then(() => {
            this.$router.push({ path: '/list2/' }) // 등록 후 list2 페이지로 이동
          })
          .catch(error => {
            console.log('에러', error)
        })
      }
    }
  }
}
</script>

<style scoped>
.write {margin:0 0 80px}
.row {display:flex;position:relative;left:-5%;margin-bottom:15px;}
.row label {width:15%;text-align:right;padding:8px 15px 0 0}
.row input, .row textarea, .row select {width:85%}
</style>