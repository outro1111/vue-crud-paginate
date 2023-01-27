<template>
  <div id="header">
    <h1><router-link to="/">Vue CRUD</router-link></h1>
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/list">List</router-link></li>
        <li><router-link to="/list2" @click="forceRerender">List2</router-link></li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  props: [ 'forceRerender' ] // App.vue List2 페이지 강제 rerender 함수를 props로 받아 사용
}
</script>

<style scoped>
#header {display:flex;padding:30px 0 10px;align-items:center}
#header h1 a {font-size:28px;font-weight:800;color:#58e4a5;}
#header nav ul {display:flex;margin-left:2rem}
#header nav a {padding:0 15px;color:var(--font-white);font-size:16px}
#header nav a.router-link-active {color:#58e4a5;font-weight:800}
</style>
