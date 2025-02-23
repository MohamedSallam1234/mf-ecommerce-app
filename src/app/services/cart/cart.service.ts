import { Injectable, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { CartItem } from 'src/app/models/cartItem.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems = signal<CartItem[]>([]);

  constructor(private authService: AuthService) {
    this.loadCart();
  }

  private getUserCartKey(): string {
    const userEmail = this.authService.getCurrentUserEmail();
    return `cart_${userEmail}`;
  }

  private async loadCart() {
    const cartKey = this.getUserCartKey();
    const { value } = await Preferences.get({ key: cartKey });
    if (value) {
      this.cartItems.set(JSON.parse(value));
    }
  }

  private async saveCart() {
    const cartKey = this.getUserCartKey();
    await Preferences.set({
      key: cartKey,
      value: JSON.stringify(this.cartItems()),
    });
  }

  async addToCart(product: any, quantity: number) {
    const currentItems = this.cartItems();
    const existingItem = currentItems.find((item) => item._id === product._id);

    if (existingItem) {
      existingItem.quantity += quantity;
      this.cartItems.set([...currentItems]);
    } else {
      this.cartItems.set([...currentItems, { ...product, quantity }]);
    }
    await this.saveCart();
  }

  async clearCart() {
    const cartKey = this.getUserCartKey();
    await Preferences.remove({ key: cartKey });
    this.cartItems.set([]);
  }

  getCartItems() {
    return this.cartItems;
  }

  async updateQuantity(_id: string, change: number) {
    const currentItems = this.cartItems();
    const newItems = currentItems
      .map((item) => {
        if (item._id === _id) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    this.cartItems.set(newItems);
    await this.saveCart();
  }

  async removeAll() {
    this.cartItems.set([]);
    await this.saveCart();
  }

  getSubtotal(): number {
    return this.cartItems().reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  getShippingCost(): number {
    return this.cartItems().length > 0 ? 8.0 : 0;
  }

  getTax(): number {
    return 0;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShippingCost() + this.getTax();
  }
}
