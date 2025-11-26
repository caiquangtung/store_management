import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from '../core/config.service';
import { ApiResponse } from '../types/api-response';
import { PaginationParams, PagedResult } from '../types/pagination';

/**
 * Base API service that provides common HTTP helpers (pagination, error handling, etc.)
 * Feature-specific services can extend this class to avoid duplicating plumbing code.
 */
export abstract class BaseApiService {
  protected readonly http = inject(HttpClient);
  protected readonly config = inject(ConfigService);
  protected readonly baseUrl = this.config.apiUrl;

  protected getPaged<T>(
    endpoint: string,
    params: PaginationParams & Record<string, unknown>
  ): Observable<ApiResponse<PagedResult<T>>> {
    return this.http
      .get<ApiResponse<PagedResult<T>>>(this.buildUrl(endpoint), {
        params: this.buildParams(params),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  protected getItem<T>(
    endpoint: string,
    params?: Record<string, unknown>
  ): Observable<ApiResponse<T>> {
    return this.http
      .get<ApiResponse<T>>(this.buildUrl(endpoint), { params: this.buildParams(params) })
      .pipe(catchError((error) => this.handleError(error)));
  }

  protected postItem<TRequest, TResponse>(
    endpoint: string,
    payload: TRequest
  ): Observable<ApiResponse<TResponse>> {
    return this.http
      .post<ApiResponse<TResponse>>(this.buildUrl(endpoint), payload)
      .pipe(catchError((error) => this.handleError(error)));
  }

  protected putItem<TRequest, TResponse>(
    endpoint: string,
    payload: TRequest
  ): Observable<ApiResponse<TResponse>> {
    return this.http
      .put<ApiResponse<TResponse>>(this.buildUrl(endpoint), payload)
      .pipe(catchError((error) => this.handleError(error)));
  }

  protected deleteItem<TResponse>(endpoint: string): Observable<ApiResponse<TResponse>> {
    return this.http
      .delete<ApiResponse<TResponse>>(this.buildUrl(endpoint))
      .pipe(catchError((error) => this.handleError(error)));
  }

  protected buildParams(params?: Record<string, unknown>): HttpParams {
    if (!params) {
      return new HttpParams();
    }

    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((item) => {
          httpParams = httpParams.append(key, `${item}`);
        });
      } else {
        httpParams = httpParams.set(key, `${value}`);
      }
    });

    return httpParams;
  }

  private buildUrl(endpoint: string): string {
    if (endpoint.startsWith('http')) {
      return endpoint;
    }
    if (endpoint.startsWith('/')) {
      return `${this.baseUrl}${endpoint}`;
    }
    return `${this.baseUrl}/${endpoint}`;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const message =
      error?.error?.message ||
      error?.message ||
      'An unexpected error occurred while communicating with the server.';

    return throwError(() => new Error(message));
  }
}
