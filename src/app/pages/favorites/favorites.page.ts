import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, heartOutline, heart } from 'ionicons/icons';
import { FavoritesService } from '../../services/favorites/favorites.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
  ],
})
export class FavoritesPage {
  constructor(
    private router: Router,
    public favoritesService: FavoritesService
  ) {
    addIcons({ arrowBackOutline, heartOutline, heart });
  }

  goBack() {
    this.router.navigate(['/tabs/home']);
  }

  async removeFromFavorites(product: any) {
    await this.favoritesService.toggleFavorite(product);
  }

  navigateToProduct(_id: string) {
    this.router.navigate(['/product', _id]);
  }
}
