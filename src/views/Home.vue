<template>
  <div class="home">
    <h2 class="title">Vue CRUD</h2>
    <div class="visual"><img src="@/assets/images/home.png" alt=""></div>
    <p>CRUD는 대부분의 컴퓨터 소프트웨어가 가지는 기본적인 데이터 처리 기능인 Create(생성), Read(읽기), Update(갱신), Delete(삭제)를 묶어서 일컫는 말이다. 사용자 인터페이스가 갖추어야 할 기능(정보의 참조/검색/갱신)을 가리키는 용어로서도 사용된다.</p>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.home {text-align:center;}
.title {display:inline-block;background:var(--gradient-color3);background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.visual img {width:28%}
p {width:60%;margin:30px auto;text-align:center;color:#fff}
</style>
