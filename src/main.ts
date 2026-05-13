import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { DataService } from './app/services/data'; // 1. Import your service

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
