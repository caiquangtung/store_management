import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfigService } from '../../core/config.service';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    expiresAt: string;
    user: {
      userId: number;
      username: string;
      fullName: string;
      role: string;
    };
  };
}

export interface User {
  userId: number;
  username: string;
  fullName: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private configService: ConfigService) {
    // Check for existing token on service initialization
    this.checkStoredToken();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.configService.endpoints.login, credentials).pipe(
      tap((response) => {
        if (response.success) {
          // Store token in localStorage
          localStorage.setItem(this.configService.tokenKey, response.data.token);
          localStorage.setItem(this.configService.userKey, JSON.stringify(response.data.user));
          localStorage.setItem(this.configService.expiresKey, response.data.expiresAt);

          // Update current user
          this.currentUserSubject.next(response.data.user);
        }
      })
    );
  }

  logout(): void {
    // Clear stored data
    localStorage.removeItem(this.configService.tokenKey);
    localStorage.removeItem(this.configService.userKey);
    localStorage.removeItem(this.configService.expiresKey);

    // Update current user
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.configService.tokenKey);
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.configService.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  private checkStoredToken(): void {
    const user = this.getCurrentUser();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  // Method to refresh token if needed
  refreshToken(): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(this.configService.endpoints.refresh, {
        token: this.getToken(),
      })
      .pipe(
        tap((response) => {
          localStorage.setItem(this.configService.tokenKey, response.token);
        })
      );
  }
}
