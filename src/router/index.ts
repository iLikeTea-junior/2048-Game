import { createRouter, createWebHistory } from 'vue-router'

import GameComponent from '@/components/GameComponent.vue'
import GamePage from '@/views/GamePage.vue'

const routes = [
  {path: '/game', component: GamePage, children: [
    {
      path: ':player',
      name: 'CurrentGame',
      component: GameComponent,
      props: true
    }
]},
  {path: '/', redirect:'/game'},
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
