
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/PageCalendar.vue') },
      { path: '/shoppinglist', component: () => import('pages/PageShoppinglist.vue') },
      { path: '/changemeal', component: () => import('pages/PageChangeMeal.vue') }
    ]
  }
]

// Always leave this as last one
routes.push({
  path: '*',
  component: () => import('pages/Error404.vue')
})

export default routes


