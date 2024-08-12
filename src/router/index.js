import mainView from'../App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/listeArticle.vue'
import modifier from '../views/modifier.vue'
import Article from '../views/Article.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/modifier',
    name: 'modifier',
    component: modifier
  },
  {
    path: '/Article',
    name: 'Article',
    component: Article
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/ajouterArticle.vue')
  }
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


export default router
