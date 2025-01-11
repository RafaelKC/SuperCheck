import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideClientHydration(withEventReplay()),
        provideAnimationsAsync(),
        provideHttpClient(
            withInterceptors([authInterceptor]),
            withFetch()
        ),
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: { appearance: 'outline' }
        }
    ]
};
