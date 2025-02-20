import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonItem,
  IonList,
  IonThumbnail,
  IonLabel,
  IonButton,
  IonIcon,
  IonTitle,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonItem,
    IonList,
    IonThumbnail,
    IonLabel,
    IonButton,
    IonIcon,
  ],
})
export class CategoriesPage {
  categories = [
    {
      name: 'Electronics',
      image: 'https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg',
    },
    {
      name: 'Jewelery',
      image: 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg',
    },
    {
      name: "Men's Clothing",
      image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    },
    {
      name: "Women's Clothing",
      image: 'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg',
    },
  ];

  constructor(private router: Router) {
    addIcons({ arrowBackOutline });
  }

  goBack() {
    this.router.navigate(['/tabs/home']);
  }

  goToCategory(category: string) {
    this.router.navigate(['/category-list', category.toLowerCase()]);
  }
}
