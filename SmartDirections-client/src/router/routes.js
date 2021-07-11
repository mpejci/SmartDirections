const routes = [
  {
    path: '/Login',
    component: () => import('layouts/LoginPageLayout.vue'),
    children: [
      {
        path: '',
        component: () =>
          import('pages/Login/LoginIndex.vue')
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/WelcomePageLayout.vue'),
    children: [
      {
        path: '',
        component: () =>
          import('pages/WelcomePage.vue')
      }
    ]
  },
  {
    path: '/Administration',
    component: () =>
      import('layouts/SmartDirectionsSystemLayout.vue'),
    meta: { auth: true },
    children: [
      {
        path: '/Nearby',
        meta: { auth: true },
        component: () =>
          import('pages/SmartDirectionsSystem/NearbyIndex.vue')
      },
      {
        path: '/User_Profile',
        meta: { auth: true },
        component: () =>
          import('pages/SmartDirectionsSystem/UserProfileIndex.vue')
      },
      {
        path: '/Main_Menu',
        meta: { auth: true },
        component: () =>
          import('pages/SmartDirectionsSystem/MainMenuIndex.vue')
      },
      {
        path: '/Search',
        meta: { auth: true },
        component: () =>
          import('pages/SmartDirectionsSystem/SearchIndex.vue')
      }
    ]
  },
  {
    path: '/Administration_Admin',
    component: () =>
      import('layouts/SmartDirectionsSystemLayoutAdmin.vue'),
    meta: { auth: true },
    children: [
      {
        path: '/Sensors',
        meta: { auth: true },
        component: () =>
          import('pages/SmartDirectionsSystem/SensorsIndex.vue')
      },
      {
        path: '/Car_Counter',
        meta: { auth: true },
        component: () =>
          import('pages/SmartDirectionsSystem/CarCounterIndex.vue')
      },
      {
        path: '/Map',
        meta: { auth: true },
        component: () =>
          import('pages/SmartDirectionsSystem/MapIndex.vue')
      },
      {
        path: '/Chart',
        meta: { auth: true },
        component: () =>
          import('pages/SmartDirectionsSystem/LineChartIndex.vue')
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
