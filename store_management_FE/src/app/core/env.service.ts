import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EnvService {
  constructor() {}

  // API Configuration
  get apiUrl(): string {
    return environment.apiUrl;
  }

  get appName(): string {
    return environment.appName;
  }

  get version(): string {
    return environment.version;
  }

  get isProduction(): boolean {
    return environment.production;
  }

  // Local Storage Keys
  get tokenKey(): string {
    return environment.tokenKey;
  }

  get userKey(): string {
    return environment.userKey;
  }

  get expiresKey(): string {
    return environment.expiresKey;
  }

  // Debug settings
  get isDebug(): boolean {
    return !environment.production;
  }

  get logLevel(): string {
    return environment.production ? 'error' : 'debug';
  }
}
