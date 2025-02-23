import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonicModule,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule],
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage {
  private router = inject(Router);
  private authService = inject(AuthService);
  private loadingCtrl = inject(LoadingController);
  private toastCtrl = inject(ToastController);

  email = signal('');
  password = signal('');
  isLoading = signal(false);
  error = signal('');

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

  async onSignin() {
    if (this.isLoading()) {
      console.warn('Sign-in attempt while already loading.');
      return;
    }

    this.isLoading.set(true);
    const loading = await this.loadingCtrl.create({
      message: 'Signing in...',
      spinner: 'circular',
      cssClass: 'custom-loading',
    });

    await loading.present();
    console.log('Loading spinner presented.');

    try {
      const credentials: User = {
        email: this.email(),
        password: this.password(),
        role: 'user',
      };

      console.log('Attempting sign in with credentials:', credentials);
      const response: any = await firstValueFrom(
        this.authService.signin(credentials)
      );
      console.log('Received response:', response);

      if (response.success) {
        this.authService.setCurrentUser(response.user);
        await this.showToast({
          message: 'Welcome back! Login successful',
          color: 'success',
          duration: 2000,
        });
        console.log('Navigating to Tabs Page.');
        if (response.user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/tabs/home']);
        }
      } else {
        console.warn('Sign-in failed without error catch:', response);
        await this.showToast({
          message: 'Login failed. Please try again.',
          color: 'danger',
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      const errorMessage =
        error.error?.message || 'Login failed. Please try again.';
      await this.showToast({
        message: errorMessage,
        color: 'danger',
        duration: 3000,
      });
    } finally {
      this.isLoading.set(false);
      await loading.dismiss();
      console.log('Loading spinner dismissed.');
    }
  }

  updateEmail(event: CustomEvent) {
    this.email.set(event.detail.value);
  }

  updatePassword(event: CustomEvent) {
    this.password.set(event.detail.value);
  }
}
