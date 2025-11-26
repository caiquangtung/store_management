import { Injectable } from '@angular/core';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(private envService: EnvService) {}

  // API Configuration
  get apiUrl(): string {
    return this.envService.apiUrl;
  }

  get authUrl(): string {
    return `${this.envService.apiUrl}/auth`;
  }

  // App Configuration
  get appName(): string {
    return this.envService.appName;
  }

  get version(): string {
    return this.envService.version;
  }

  get isProduction(): boolean {
    return !this.envService.isDebug;
  }

  // Local Storage Keys
  get tokenKey(): string {
    return this.envService.tokenKey;
  }

  get userKey(): string {
    return this.envService.userKey;
  }

  get expiresKey(): string {
    return this.envService.expiresKey;
  }

  // API Endpoints
  get endpoints() {
    return {
      login: `${this.authUrl}/login`,
      refresh: `${this.authUrl}/refresh`,
      logout: `${this.authUrl}/logout`,
      profile: `${this.authUrl}/profile`,
    };
  }

  // Get full API URL for a specific endpoint
  getApiUrl(endpoint: string): string {
    return `${this.apiUrl}${endpoint}`;
  }
}
