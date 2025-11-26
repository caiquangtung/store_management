import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductListComponent } from './product-list.component';

@NgModule({
  imports: [CommonModule, ProductsRoutingModule, ProductListComponent],
})
export class ProductsModule {}
