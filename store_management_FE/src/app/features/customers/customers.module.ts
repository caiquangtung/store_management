import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersRoutingModule } from './customers-routing.module';
import { CustomerListComponent } from './customer-list.component';

@NgModule({
  imports: [CommonModule, CustomersRoutingModule, CustomerListComponent],
})
export class CustomersModule {}
