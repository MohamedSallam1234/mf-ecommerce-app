import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonIcon,
  IonSearchbar,
  IonThumbnail,
  IonGrid,
  IonRow,
  IonCol,
  IonSkeletonText,
  IonContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  notificationsOutline,
  personOutline,
  heartOutline,
  bagOutline,
  chevronDownOutline,
  searchOutline,
  home,
  cartOutline,
  heart,
} from 'ionicons/icons';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonIcon,
    IonSearchbar,
    IonThumbnail,
    IonGrid,
    IonRow,
    IonCol,
    RouterModule,
    IonSkeletonText,
    IonContent,
  ],
})
export class HomePage implements OnInit {
  private productService = inject(ProductService);
  public favoritesService = inject(FavoritesService);
  private router = inject(Router);
  categories = [
    {
      name: 'Electronics',
      image: 'https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg',
    },
    {
      name: 'Jewelery',
      image: 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg',
    },
    {
      name: "Men's Clothing",
      image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    },
    {
      name: "Women's Clothing",
      image: 'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg',
    },
  ];

  products = signal<any[]>([]);
  filteredProducts = signal<any[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);
  searchTerm = signal('');

  constructor() {
    addIcons({
      cartOutline,
      chevronDownOutline,
      bagOutline,
      heartOutline,
      home,
      notificationsOutline,
      personOutline,
      homeOutline,
      searchOutline,
      heart,
    });
  }

  onSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.searchTerm.set(searchTerm);

    if (!searchTerm) {
      this.filteredProducts.set(this.products());
      return;
    }

    const filtered = this.products().filter((product) => {
      return (
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    });

    this.filteredProducts.set(filtered);
  }

  async loadProducts() {
    this.isLoading.set(true);
    this.error.set(null);

    this.productService
      .getProducts()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (products) => {
          this.products.set(products);
          this.filteredProducts.set(products);
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.error.set(error.message || 'Failed to load products');
        },
      });
  }

  ngOnInit() {
    this.loadProducts();
  }
  async toggleFavorite(event: Event, product: any) {
    event.stopPropagation();
    await this.favoritesService.toggleFavorite(product);
  }
  navigateToProduct(id: number) {
    this.router.navigate(['/product', id]);
  }
}
