import { Injectable, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

const CART_KEY = 'cart_items';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);

  constructor() {
    this.loadCart();
  }

  private async loadCart() {
    const { value } = await Preferences.get({ key: CART_KEY });
    if (value) {
      this.cartItems.set(JSON.parse(value));
    }
  }

  private async saveCart(items: CartItem[]) {
    await Preferences.set({
      key: CART_KEY,
      value: JSON.stringify(items),
    });
  }

  getCartItems() {
    return this.cartItems;
  }

  async addToCart(
    product: any,
    quantity: number = 1,
    size: string = 'M',
    color: string = ''
  ) {
    const currentItems = this.cartItems();
    const existingItem = currentItems.find((item) => item.id === product.id);

    let newItems: CartItem[];
    if (existingItem) {
      newItems = currentItems.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      const newItem: CartItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity,
        size,
        color,
      };
      newItems = [...currentItems, newItem];
    }

    this.cartItems.set(newItems);
    await this.saveCart(newItems);
  }

  async updateQuantity(productId: number, change: number) {
    const currentItems = this.cartItems();
    const newItems = currentItems
      .map((item) => {
        if (item.id === productId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    this.cartItems.set(newItems);
    await this.saveCart(newItems);
  }

  async removeAll() {
    this.cartItems.set([]);
    await this.saveCart([]);
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
    return 0; // Implement tax calculation if needed
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShippingCost() + this.getTax();
  }
}
