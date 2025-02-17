import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonTabButton,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabs,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, heartOutline, personOutline } from 'ionicons/icons';

const orderIcon = 'assets/icon/order-icon.svg';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonTabButton,
    IonIcon,
    IonRouterOutlet,
    IonTabBar,
    IonTabs,
  ],
})
export class TabsPage {
  constructor() {
    addIcons({
      homeOutline,
      orderIcon,
      heartOutline,
      personOutline,
    });
  }
}
