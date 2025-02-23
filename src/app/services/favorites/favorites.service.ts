import { Injectable, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Product } from 'src/app/models/product.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  favorites = signal<Product[]>([]);

  constructor(private authService: AuthService) {
    this.loadFavorites();
  }

  private getUserFavoritesKey(): string {
    const userEmail = this.authService.getCurrentUserEmail();
    return `favorites_${userEmail}`;
  }

  private async loadFavorites() {
    const favoritesKey = this.getUserFavoritesKey();
    const { value } = await Preferences.get({ key: favoritesKey });
    if (value) {
      this.favorites.set(JSON.parse(value));
    }
  }

  private async saveFavorites() {
    const favoritesKey = this.getUserFavoritesKey();
    await Preferences.set({
      key: favoritesKey,
      value: JSON.stringify(this.favorites()),
    });
  }

  async toggleFavorite(product: Product) {
    const currentFavorites = this.favorites();
    const index = currentFavorites.findIndex((p) => p._id === product._id);

    if (index > -1) {
      currentFavorites.splice(index, 1);
    } else {
      currentFavorites.push(product);
    }

    this.favorites.set([...currentFavorites]);
    await this.saveFavorites();
  }

  async clearFavorites() {
    const favoritesKey = this.getUserFavoritesKey();
    await Preferences.remove({ key: favoritesKey });
    this.favorites.set([]);
  }

  isFavorite(productId: string): boolean {
    return this.favorites().some((p) => p._id === productId);
  }
}
