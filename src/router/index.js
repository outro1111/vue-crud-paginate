import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/:pathMatch(.*)*', // 404 Not fount Route - 매치되는 라우터 주소가 없을 시 Home으로 redirect
    redirect: { name: 'Home' }
  },
  {
    path: '/list',
    name: 'Board',
    component: () => import('@/views/Board/Board.vue'),
    children: [ // Board 안에 자식요소로 라우터 구성
      {
        path: '/list',
        name: 'List',
        component: () => import('@/views/Board/List.vue')
      },
      {
        path: '/list/:id', // 라우터 url path에 id를 params로 입력하여 id에 맞는 글을 불러옴
        name: 'Detail',
        component: () => import('@/views/Board/Detail.vue'),
        props: true // 파라미터를 props로 전달 가능하게 설정 - props로 전달안하면 id: this.$route.params.id로 데이터 설정
      },
      {
        path: '/list/write/:id?', // 게시글 수정 시에만 파라미터를 적용하기 위해 ? 사용
        name: 'Write',
        component: () => import('@/views/Board/Write.vue'),
        props: true 
      }
    ]
  },
  {
    path: '/list2',
    name: 'Board2',
    component: () => import('@/views/Board2/Board.vue'),
    children: [
      {
        path: '/list2',
        name: 'List2',
        component: () => import('@/views/Board2/List.vue')
      },
      {
        path: '/list2/:id',
        name: 'Detail2',
        component: () => import('@/views/Board2/Detail.vue'),
        props: true
      },
      {
        path: '/list2/write/:id?',
        name: 'Write2',
        component: () => import('@/views/Board2/Write.vue'),
        props: true
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
