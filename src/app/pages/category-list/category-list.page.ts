import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, heartOutline } from 'ionicons/icons';
import { CategoriesService } from '../../services/categories.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.page.html',
  styleUrls: ['./category-list.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonSkeletonText,
  ],
})
export class CategoryListPage implements OnInit {
  categoryName: string = '';
  products = signal<any[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoriesService: CategoriesService
  ) {
    addIcons({ arrowBackOutline, heartOutline });
  }

  ngOnInit() {
    this.categoryName = this.route.snapshot.paramMap.get('category') || '';
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading.set(true);
    this.error.set(null);

    this.categoriesService
      .getProductsByCategory(this.categoryName)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (products) => {
          this.products.set(products);
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.error.set('Failed to load products. Please try again.');
        },
      });
  }

  goBack() {
    this.router.navigate(['/categories']);
  }
}
