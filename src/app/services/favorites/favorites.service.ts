import { Injectable, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

const FAVORITES_KEY = 'favorites';

export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
}

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private favorites = signal<Product[]>([]);

  constructor() {
    this.loadFavorites();
  }

  private async loadFavorites() {
    const { value } = await Preferences.get({ key: FAVORITES_KEY });
    if (value) {
      this.favorites.set(JSON.parse(value));
    }
  }

  private async saveFavorites(favorites: Product[]) {
    await Preferences.set({
      key: FAVORITES_KEY,
      value: JSON.stringify(favorites),
    });
  }

  getFavorites() {
    return this.favorites;
  }

  async toggleFavorite(product: Product) {
    const currentFavorites = this.favorites();
    const index = currentFavorites.findIndex((p) => p.id === product.id);

    let newFavorites: Product[];
    if (index === -1) {
      newFavorites = [...currentFavorites, product];
    } else {
      newFavorites = currentFavorites.filter((p) => p.id !== product.id);
    }

    this.favorites.set(newFavorites);
    await this.saveFavorites(newFavorites);
  }

  isFavorite(productId: number): boolean {
    return this.favorites().some((p) => p.id === productId);
  }
}
