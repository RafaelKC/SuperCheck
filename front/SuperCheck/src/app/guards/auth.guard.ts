import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

export const authGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (!isPlatformBrowser(platformId)) {
        return true; // Allow during SSR
    }

    if (authService.isAuthenticated()) {
        return true;
    }

    router.navigate(['/login']);
    return false;
};
