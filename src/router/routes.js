
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PageHome.vue') },
      { path: '/camera', component: () => import('pages/PageCamera.vue') },
      {
        path: '/auth',
        component: () => import('pages/Auth.vue'),
        children: [
          {
            path: 'forgotPassword',
            name: 'ForgotPassword',
            component: () => import('pages/ForgotPassword.vue')
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
