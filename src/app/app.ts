import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet], // 2. MAKE SURE THIS IS ADDED TO IMPORTS
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [`
    /* Keep this empty or use it only for global reset rules */
  `]
})
export class App {
  protected readonly title = signal('my-scpwdsystem');
}
