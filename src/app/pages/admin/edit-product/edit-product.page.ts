import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product/product.service';
import { AdminService } from '../../../services/admin/admin.service';
import { Product } from '../../../models/product.model';
import { finalize } from 'rxjs';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.page.html',
  styleUrls: ['./edit-product.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
})
export class EditProductPage implements OnInit {
  product = signal<Product>({
    _id: '',
    title: '',
    price: 0,
    description: '',
    category: '',
    image: '',
  });
  error = signal<string | null>(null);
  isLoading = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private adminService: AdminService
  ) {
    addIcons({ arrowBackOutline });
  }

  ngOnInit() {
    const _id = this.route.snapshot.paramMap.get('id');
    if (_id) {
      this.loadProduct(_id);
    }
  }

  private loadProduct(_id: string) {
    this.isLoading.set(true);
    this.productService
      .getProductById(_id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (product) => this.product.set(product),
        error: (error) => {
          console.error('Error loading product:', error);
          this.error.set('Failed to load product');
        },
      });
  }

  async saveProduct() {
    if (!this.validateProduct()) {
      return;
    }

    try {
      this.isLoading.set(true);
      await this.adminService
        .updateProduct(this.product()._id, this.product())
        .toPromise();

      this.router.navigate(['/admin']);
    } catch (error) {
      console.error('Error updating product:', error);
      this.error.set('Failed to update product');
    } finally {
      this.isLoading.set(false);
    }
  }

  private validateProduct(): boolean {
    const product = this.product();
    if (
      !product.title ||
      !product.price ||
      !product.description ||
      !product.category ||
      !product.image
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
