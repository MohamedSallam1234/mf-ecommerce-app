import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, addOutline, removeOutline } from 'ionicons/icons';
import { CartService } from '../../services/cart/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonButton, IonIcon],
})
export class CartPage {
  constructor(
    private router: Router,
    public cartService: CartService,
    private toastCtrl: ToastController
  ) {
    addIcons({ arrowBackOutline, addOutline, removeOutline });
  }

  goBack() {
    this.router.navigate(['/tabs/home']);
  }

  async updateQuantity(productId: number, change: number) {
    await this.cartService.updateQuantity(productId, change);
  }

  async removeAll() {
    await this.cartService.removeAll();
  }

  async checkout() {
    await this.showToast({
      message: 'Order placed successfully!',
      color: 'success',
      duration: 3000,
    });
    this.router.navigate(['/tabs/home']);
  }

  private async showToast({
    message,
    color,
    duration,
  }: {
    message: string;
    color: 'success' | 'danger';
    duration: number;
  }) {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      color,
      position: 'bottom',
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel',
        },
      ],
      cssClass: `toast-${color}`,
    });
    await toast.present();
  }
}
