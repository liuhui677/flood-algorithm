import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/scan-line',
    },
    {
      path: '/scan-line',
      name: 'ScanLine',
      component: () => import('../views/ScanLinePage.vue'),
      meta: { title: '扫描线查找封闭图形' },
    },
    {
      path: '/variable-compilation',
      name: 'VariableCompilation',
      component: () => import('../views/VariableCompilationPage.vue'),
      meta: { title: '变量编译（字符串→函数）' },
    },
  ],
})

export default router
