import { Routes } from '@angular/router';
import { TabsPage } from './pages/tabs/tabs.page';
import { HomePage } from './pages/home/home.page';
// import { NotificationsPage } from './pages/notifications/notifications.page';
// import { CartPage } from './pages/cart/cart.page';
// import { ProfilePage } from './pages/profile/profile.page';
import { authGuard } from './guards/auth.guard';
import { SignInPage } from './pages/sign-in/sign-in.page';
export const routes: Routes = [
  // Login route (public)
  { path: 'login', component: SignInPage },

  // Main app routes protected by authGuard
  {
    path: '',
    canActivate: [authGuard],
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomePage,
      },
      // {
      //   path: 'notifications',
      //   component: NotificationsPage,
      //   // Example: Only admin can access notifications
      //   // data: { roles: ['admin'] },
      // },
      // {
      //   path: 'cart',
      //   component: CartPage,
      // },
      // {
      //   path: 'profile',
      //   component: ProfilePage,
      // },
    ],
  },

  // Fallback if no route matches
  { path: '**', redirectTo: 'login' },
];
