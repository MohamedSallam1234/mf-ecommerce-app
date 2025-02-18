import { Routes } from '@angular/router';
import { TabsPage } from './pages/tabs/tabs.page';
import { HomePage } from './pages/home/home.page';
// import { NotificationsPage } from './pages/notifications/notifications.page';
// import { CartPage } from './pages/cart/cart.page';
// import { ProfilePage } from './pages/profile/profile.page';
//import { authGuard } from './guards/auth.guard';
import { SignInPage } from './pages/sign-in/sign-in.page';
import { SignUpPage } from './pages/sign-up/sign-up.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'signin',
    pathMatch: 'full',
  },
  {
    path: 'signin',
    component: SignInPage,
  },
  {
    path: 'signup',
    component: SignUpPage,
  },
  {
    path: 'tabs',
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
  {
    path: '**',
    redirectTo: 'signin',
  },
];
