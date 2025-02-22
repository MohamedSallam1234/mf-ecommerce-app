import { Routes } from '@angular/router';
import { TabsPage } from './pages/tabs/tabs.page';
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
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('./pages/favorites/favorites.page').then(
            (m) => m.FavoritesPage
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./pages/categories/categories.page').then(
        (m) => m.CategoriesPage
      ),
  },
  {
    path: 'category-list/:category',
    loadComponent: () =>
      import('./pages/category-list/category-list.page').then(
        (m) => m.CategoryListPage
      ),
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./pages/product-details/product-details.page').then(
        (m) => m.ProductDetailsPage
      ),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart/cart.page').then((m) => m.CartPage),
  },
  {
    path: '**',
    redirectTo: 'signin',
  },
];
