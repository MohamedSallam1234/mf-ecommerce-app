import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin/admin.service';
import { Product } from '../../../models/product.model';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class AddProductPage {
  newProduct = signal<Omit<Product, '_id'>>({
    title: '',
    price: 0,
    description: '',
    category: '',
    image: '',
  });
  error = signal<string | null>(null);
  isLoading = signal(false);

  constructor(private router: Router, private adminService: AdminService) {
    addIcons({ arrowBackOutline });
  }

  async addProduct() {
    if (!this.validateProduct()) {
      return;
    }
    this.isLoading.set(true);
    this.error.set(null);

    this.adminService
      .addProduct(this.newProduct())
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/admin']),
        error: (error) => this.error.set('Failed to add product'),
      });
  }

  private validateProduct(): boolean {
    const product = this.newProduct();
    if (
      !product.title ||
      !product.price ||
      !product.description ||
      !product.category
    ) {
      this.error.set('Please fill in all required fields');
      return false;
    }
    return true;
  }

  goBack() {
    this.router.navigate(['/admin']);
  }
}
