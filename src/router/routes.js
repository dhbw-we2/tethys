
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/PageCalender.vue') },
      { path: '/shoppinglist', component: () => import('pages/PageShoppinglist.vue') },
      { path: '/changemeal', component: () => import('pages/PageChangeMeal.vue') },
      { path: '/profile', component: () => import('pages/PageProfile.vue') },
      {
        path: '/auth',
        component: () => import('layouts/MainLayout.vue'),
        children: [
          {
            path: 'forgotPassword',
            name: 'ForgotPassword',
            component: () => import('pages/ForgotPasswordPage.vue')
          },
          {
            path: 'login',
            name: 'Login',
            component: () => import('pages/AuthPage.vue')
          },
          {
            path: 'register',
            name: 'Register',
            component: () => import('pages/AuthPage.vue')
          }
        ]
      }
    ]
  }
]

// Always leave this as last one
routes.push({
  path: '*',
  component: () => import('pages/Error404.vue')
})

export default routes


