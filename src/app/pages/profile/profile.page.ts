import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonAvatar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronForward,
  homeOutline,
  notificationsOutline,
  receiptOutline,
  personOutline,
  logOutOutline,
  camera,
  cardOutline,
  helpCircleOutline,
} from 'ionicons/icons';

const PROFILE_IMAGE_KEY = 'profile_image';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
  ],
})
export class ProfilePage implements OnInit {
  profileImage = signal<string>('assets/images/avatar.svg');
  userName = signal('Gilbert Jones');
  userEmail = signal('GIbertjones001@gmail.com');

  menuItems = [
    { title: 'Address', icon: 'home-outline' },
    { title: 'Wishlist', icon: 'heart-outline' },
    { title: 'Payment', icon: 'card-outline' },
    { title: 'Help', icon: 'help-circle-outline' },
  ];

  constructor(private router: Router) {
    addIcons({
      chevronForward,
      homeOutline,
      notificationsOutline,
      receiptOutline,
      personOutline,
      logOutOutline,
      cardOutline,
      helpCircleOutline,
      camera,
    });
  }

  async ngOnInit() {
    await this.loadProfileImage();
  }

  private async loadProfileImage() {
    const { value } = await Preferences.get({ key: PROFILE_IMAGE_KEY });
    if (value) {
      this.profileImage.set(value);
    }
  }

  private async saveProfileImage(imageData: string) {
    await Preferences.set({
      key: PROFILE_IMAGE_KEY,
      value: imageData,
    });
  }

  async changeProfileImage() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e: any) => {
          const imageData = e.target.result;
          this.profileImage.set(imageData);
          await this.saveProfileImage(imageData);
        };
        reader.readAsDataURL(file);
      }
    };

    fileInput.click();
  }

  async signOut() {
    // Optional: Clear profile image on sign out
    await Preferences.remove({ key: PROFILE_IMAGE_KEY });
    this.router.navigate(['/sign-in']);
  }
}
