import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AdminService } from '../../services/admin/admin.service';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../models/product.model';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  addOutline,
  cubeOutline,
  createOutline,
  trashOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
})
export class AdminDashboardPage {
  products = signal<Product[]>([]);
  isLoading = signal(false);

  constructor(
    private adminService: AdminService,
    private productService: ProductService
  ) {
    addIcons({ addOutline, cubeOutline, createOutline, trashOutline });
    this.loadProducts();
  }

  private loadProducts() {
    this.isLoading.set(true);
    this.productService.getProducts().subscribe({
      next: (products) => this.products.set(products),
      error: (error) => console.error('Error loading products:', error),
      complete: () => this.isLoading.set(false),
    });
  }

  async deleteProduct(_id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.adminService.deleteProduct(_id).subscribe({
        next: () => {
          this.products.set(this.products().filter((p) => p._id !== _id));
        },
        error: (error) => console.error('Error deleting product:', error),
      });
    }
  }
}
