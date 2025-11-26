import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../features/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const user = this.auth.getCurrentUser();
    const isAuthenticated = this.auth.isAuthenticated();

    if (!isAuthenticated) {
      // Not logged in -> redirect to login
      return this.router.parseUrl('/auth/login');
    }

    if (user && (user.role === 'Admin' || user.role === 'admin')) {
      return true;
    }

    // Not authorized -> redirect to login (or could redirect to unauthorized page)
    return this.router.parseUrl('/auth/login');
  }
}
