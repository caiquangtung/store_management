import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../core/config.service';
import { forkJoin, map, Observable } from 'rxjs';

export interface RecentOrder {
  id: number;
  customer: string;
  total: string;
  status: string;
}

export interface Kpis {
  totalSales: number;
  ordersCount: number;
  customersCount: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private http: HttpClient, private config: ConfigService) {}

  private getApi(endpoint: string) {
    return this.config.getApiUrl(endpoint);
  }

  getRecentOrders(): Observable<RecentOrder[]> {
    const url = this.getApi('/orders?pageNumber=1&pageSize=5');
    return this.http.get<any>(url).pipe(
      map((res) => {
        // Try several shapes: {success,message,data:{items:[],totalCount}} or {data: {items}}
        const items = res?.data?.items ?? res?.data ?? res?.items ?? [];
        return (items as any[]).map((it: any) => ({
          id: it.orderId ?? it.id ?? it.orderId,
          customer: it.customerName ?? it.customer ?? 'N/A',
          total: it.totalAmount ?? it.finalAmount ?? it.total ?? '$0',
          status: it.status ?? 'Unknown',
        }));
      })
    );
  }

  getCounts(): Observable<Kpis> {
    const ordersUrl = this.getApi('/orders?pageNumber=1&pageSize=1');
    const productsUrl = this.getApi('/products?pageNumber=1&pageSize=1');
    const customersUrl = this.getApi('/customers?pageNumber=1&pageSize=1');

    return forkJoin({
      orders: this.http.get<any>(ordersUrl),
      products: this.http.get<any>(productsUrl),
      customers: this.http.get<any>(customersUrl),
    }).pipe(
      map((res) => {
        const ordersCount =
          res.orders?.data?.totalCount ??
          res.orders?.data?.total ??
          res.orders?.totalCount ??
          res.orders?.data?.items?.length ??
          0;
        const productsCount =
          res.products?.data?.totalCount ??
          res.products?.data?.total ??
          res.products?.totalCount ??
          res.products?.data?.items?.length ??
          0;
        const customersCount =
          res.customers?.data?.totalCount ??
          res.customers?.data?.total ??
          res.customers?.totalCount ??
          res.customers?.data?.items?.length ??
          0;

        // totalSales can't be easily derived from these endpoints without a dedicated totals endpoint
        return {
          totalSales: 0,
          ordersCount: Number(ordersCount) || 0,
          customersCount: Number(customersCount) || 0,
        } as Kpis;
      })
    );
  }
}
