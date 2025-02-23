import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  heartOutline,
  heart,
  add,
  remove,
} from 'ionicons/icons';
import { ProductService } from '../../services/product/product.service';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { finalize } from 'rxjs';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonButton, IonIcon, IonSkeletonText],
})
export class ProductDetailsPage implements OnInit {
  product = signal<any>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);
  quantity = signal(1);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    public favoritesService: FavoritesService,
    public cartService: CartService
  ) {
    addIcons({ arrowBackOutline, heartOutline, heart, add, remove });
  }

  ngOnInit() {
    const _id = this.route.snapshot.paramMap.get('id');
    if (_id) {
      this.loadProduct(_id);
    }
  }

  loadProduct(_id: string) {
    this.isLoading.set(true);
    this.error.set(null);

    this.productService
      .getProductById(_id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (product) => this.product.set(product),
        error: (error) => {
          console.error('Error loading product:', error);
          this.error.set('Failed to load product details');
        },
      });
  }

  async toggleFavorite(event: Event) {
    event.stopPropagation();
    if (this.product()) {
      await this.favoritesService.toggleFavorite(this.product());
    }
  }

  updateQuantity(change: number) {
    const newQuantity = this.quantity() + change;
    if (newQuantity >= 1) {
      this.quantity.set(newQuantity);
    }
  }

  goBack() {
    this.router.navigate(['/tabs/home']);
  }

  addToBag() {
    this.cartService.addToCart(this.product(), this.quantity());
    console.log('Add to bag:', this.product(), 'Quantity:', this.quantity());
  }
}
