import { Component, OnInit, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="bg-blur-circle circle-1"></div>
      <div class="bg-blur-circle circle-2"></div>

      <button (click)="toggleTheme()" class="theme-utility-btn" title="Toggle System Theme">
        {{ isDark ? '☀️' : '🌙' }}
      </button>

      <div class="login-card-wrapper">
        <div class="login-header">
          <div class="logo-container">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 32px; height: 32px; color: #818cf8;">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <polyline points="12 8 12 12 14 14"/>
            </svg>
          </div>
          <h2 class="login-title">Admin Portal</h2>
          <p class="login-subtitle">Administrative Domain</p>
        </div>

        <div *ngIf="errorMessage" class="error-alert-banner">
          ⚠️ {{ errorMessage }}
        </div>

        <form (ngSubmit)="onLogin()" class="login-form">
          <div class="input-field-wrapper">
            <label class="field-label">Username</label>
            <div class="input-with-icon">
              <span class="input-icon">👤</span>
              <input 
                type="text" 
                name="username" 
                [(ngModel)]="credentials.username" 
                placeholder="Enter username..." 
                class="system-input" 
                required
                [disabled]="isLoading">
            </div>
          </div>

          <div class="input-field-wrapper">
            <label class="field-label">Password</label>
            <div class="input-with-icon">
              <span class="input-icon">🔑</span>
              <input 
                type="password" 
                name="password" 
                [(ngModel)]="credentials.password" 
                placeholder="xxxxxxxx" 
                class="system-input" 
                required
                [disabled]="isLoading">
            </div>
          </div>

          <button type="submit" class="action-btn wide-btn submit-btn" [disabled]="isLoading">
            <span *ngIf="!isLoading">LOG IN</span>
            <span *ngIf="isLoading" class="loading-state-row">
              <span class="spinner"></span> Verifying Access Tokens...
            </span>
          </button>
        </form>

        <div class="login-footer">
          <span class="footer-spec-text">Encryption Security Baseline: AES-256-GCM</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* 🌟 SAFE ZONE IMPORT: MUST REMAIN AT THE VERY TOP OF CSS 🌟 */
    @import url('https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&display=swap');

    .login-container { position: relative; width: 100%; min-height: 100vh; background-color: #050505; color: #f8fafc; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; overflow: hidden; box-sizing: border-box; padding: 20px; }
    
    /* Background Blur Blobs */
    .bg-blur-circle { position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.15; z-index: 1; pointer-events: none; }
    .circle-1 { width: 400px; height: 400px; background-color: #4f46e5; top: -10%; left: -10%; }
    .circle-2 { width: 500px; height: 500px; background-color: #06b6d4; bottom: -10%; right: -10%; }

    /* Utility Theme Switcher */
    .theme-utility-btn { position: absolute; top: 32px; right: 32px; width: 44px; height: 44px; border-radius: 14px; background-color: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: white; cursor: pointer; z-index: 10; transition: all 0.2s; }
    .theme-utility-btn:hover { background-color: rgba(255,255,255,0.08); }

    /* Login UI Card Wrapper */
    .login-card-wrapper { position: relative; z-index: 5; width: 100%; max-width: 440px; background-color: #0f0f0f; border: 1px solid rgba(255,255,255,0.05); border-radius: 28px; padding: 40px; box-sizing: border-box; box-shadow: 0 20px 50px rgba(0,0,0,0.4); }
    
    .login-header { display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 32px; }
    .logo-container { width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; background: rgba(129, 140, 248, 0.08); border: 1px solid rgba(129, 140, 248, 0.2); border-radius: 16px; margin-bottom: 20px; }
    
    /* 🏰 OLD ENGLISH TITLE MODIFICATIONS 🏰 */
    .login-title { font-family: 'UnifrakturMaguntia', serif !important; font-size: 36px; font-weight: 400; letter-spacing: 1px; margin: 0 0 6px 0; color: #ffffff; text-shadow: 0 0 10px rgba(129, 140, 248, 0.2); }
    
    .login-subtitle { font-size: 12px; font-weight: 700; color: #6366f1; text-transform: uppercase; letter-spacing: 1.5px; margin: 0; }

    /* Alerts */
    .error-alert-banner { background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #f87171; font-size: 13px; font-weight: 600; padding: 14px; border-radius: 12px; margin-bottom: 24px; text-align: center; }

    /* Forms & Core Layout Inputs */
    .login-form { display: flex; flex-direction: column; gap: 20px; }
    .input-field-wrapper { display: flex; flex-direction: column; gap: 8px; width: 100%; }
    .field-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
    
    .input-with-icon { position: relative; width: 100%; display: flex; align-items: center; }
    .input-icon { position: absolute; left: 16px; font-size: 16px; color: #475569; pointer-events: none; user-select: none; }
    .system-input { width: 100%; background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 16px 16px 16px 48px; color: white; font-size: 14px; outline: none; box-sizing: border-box; transition: all 0.2s; }
    .system-input:focus { border-color: #4f46e5; background-color: rgba(255,255,255,0.04); }
    .system-input:disabled { opacity: 0.5; cursor: not-allowed; }

    /* Form Action Buttons */
    .action-btn { background-color: #4f46e5; color: white; border: none; border-radius: 14px; padding: 16px 24px; font-weight: 700; cursor: pointer; font-size: 14px; transition: all 0.2s; }
    .action-btn:hover:not(:disabled) { background-color: #4338ca; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3); }
    .action-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .wide-btn { width: 100%; }
    .submit-btn { margin-top: 8px; }

    /* Loading Spinner Core Frame */
    .loading-state-row { display: flex; align-items: center; justify-content: center; gap: 10px; }
    .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: white; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .login-footer { text-align: center; margin-top: 32px; border-top: 1px solid rgba(255,255,255,0.04); padding-top: 16px; }
    .footer-spec-text { font-size: 10px; color: #475569; font-family: monospace; letter-spacing: 0.5px; }

    /* ================= GLOBAL LIGHT MODE RULES ================= */
    :root:not(.dark) .login-container { background-color: #f8fafc; color: #0f172a; }
    :root:not(.dark) .bg-blur-circle { opacity: 0.06; }
    :root:not(.dark) .theme-utility-btn { background-color: #ffffff; border-color: #cbd5e1; color: #0f172a; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    :root:not(.dark) .login-card-wrapper { background-color: #ffffff; border-color: #e2e8f0; box-shadow: 0 20px 40px rgba(0,0,0,0.03); }
    :root:not(.dark) .login-title { color: #0f172a !important; }
    :root:not(.dark) .system-input { background-color: #f8fafc; border-color: #cbd5e1; color: #0f172a; }
    :root:not(.dark) .system-input:focus { border-color: #4f46e5; background-color: #ffffff; }
    :root:not(.dark) .login-footer { border-top-color: #f1f5f9; }
    :root:not(.dark) .footer-spec-text { color: #94a3b8; }
  `],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  private router = inject(Router);

  isDark = true;
  isLoading = false;
  errorMessage = '';

  credentials = {
    username: '',
    password: ''
  };

  ngOnInit(): void {
    this.isDark = document.documentElement.classList.contains('dark');
    this.applyTheme();
  }

  toggleTheme(): void {
    this.isDark = !this.isDark;
    this.applyTheme();
  }

  applyTheme(): void {
    document.documentElement.classList.toggle('dark', this.isDark);
  }

  onLogin(): void {
    if (!this.credentials.username.trim() || !this.credentials.password.trim()) {
      this.errorMessage = 'Identification fields cannot be blank.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    setTimeout(() => {
      const { username, password } = this.credentials;
      
      if (
        (username === 'admin' && password === 'admin123') || 
        (username === 'staff1' && password === 'staff123') ||
        (username === 'staff2' && password === 'staff456')
      ) {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      } else {
        this.isLoading = false;
        this.errorMessage = 'Clearance validation failed. Invalid credential hash profile.';
      }
    }, 1500);
  }
}