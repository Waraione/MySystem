import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export type UserRole = 'Super Admin' | 'Staff Officer';

export interface UserSession {
  name: string;
  email: string;
  role: UserRole;
  branch: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSession: UserSession | null = null;

  constructor(private router: Router) {}

  login(role: UserRole, name: string): void {
    this.currentUserSession = {
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '')}@gobcute.gov.ph`,
      role,
      branch: 'Bugo United States of Apike District Office'
    };
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.currentUserSession = null;
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUserSession !== null;
  }

  getUser(): UserSession | null {
    return this.currentUserSession;
  }

  hasRole(expectedRole: UserRole): boolean {
    return this.currentUserSession?.role === expectedRole;
  }
}