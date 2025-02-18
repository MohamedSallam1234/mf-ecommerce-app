import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner,
  LoadingController,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../models/user.model';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  standalone: true,
  imports: [
    RouterModule,
    IonInput,
    CommonModule,
    FormsModule,
    IonContent,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonSpinner,
  ],
})
export class SignUpPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  private loadingCtrl = inject(LoadingController);
  private toastCtrl = inject(ToastController);

  firstName = signal('');
  lastName = signal('');
  email = signal('');
  password = signal('');
  isLoading = signal(false);

  constructor() {
    addIcons({ arrowBackOutline });
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

  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return email ? emailRegex.test(email) : true;
  }

  isValidPassword(password: string): boolean {
    return password ? password.length >= 6 : true;
  }

  async onSignup() {
    if (this.isLoading()) {
      console.warn('Sign-up attempt while already loading.');
      return;
    }

    // Add validation checks before proceeding
    if (!this.isValidEmail(this.email())) {
      await this.showToast({
        message: 'Please enter a valid email address',
        color: 'danger',
        duration: 3000,
      });
      return;
    }

    if (!this.isValidPassword(this.password())) {
      await this.showToast({
        message: 'Password must be at least 6 characters long',
        color: 'danger',
        duration: 3000,
      });
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
        firstName: this.firstName(),
        lastName: this.lastName(),
        email: this.email(),
        password: this.password(),
      };
      console.log('Attempting sign-up with credentials:', credentials);
      const response: any = await firstValueFrom(
        this.authService.signup(credentials)
      );
      console.log('Received response:', response);
      if (response.success) {
        await this.showToast({
          message: 'Account created successfully!',
          color: 'success',
          duration: 2000,
        });
        console.log('Navigating to Tabs Page.');
        this.router.navigate(['/tabs']);
      } else {
        console.warn('Sign-up failed without error catch:', response);
        await this.showToast({
          message: 'Sign-up failed. Please try again.',
          color: 'danger',
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error('Sign in error caught:', error);
      const errorMessage =
        error.error?.message || 'Sign-up failed. Please try again.';
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

  updateFirstName(event: CustomEvent) {
    this.firstName.set(event.detail.value);
  }

  updateLastName(event: CustomEvent) {
    this.lastName.set(event.detail.value);
  }

  updateEmail(event: CustomEvent) {
    this.email.set(event.detail.value);
  }

  updatePassword(event: CustomEvent) {
    this.password.set(event.detail.value);
  }
}
