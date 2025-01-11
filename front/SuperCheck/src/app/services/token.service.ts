import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { User } from '../interfaces/user.auth.interface';

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    private readonly TOKEN_KEY = 'auth_token';
    private platformId = inject(PLATFORM_ID);

    public setToken(token: string): void {
        if (this.isBrowser) {
            localStorage.setItem(this.TOKEN_KEY, token);
        }
    }

    public getToken(): string | null {
        if (this.isBrowser) {
            return localStorage.getItem(this.TOKEN_KEY);
        }
        return null;
    }

    public removeToken(): void {
        if (this.isBrowser) {
            localStorage.removeItem(this.TOKEN_KEY);
        }
    }

    public getUser(): User | null {
        const token = this.getToken();
        if (!token) return null;

        try {
            const decoded = jwtDecode(token) as any;
            return {
                id: decoded.Id,
                name: decoded.unique_name,
                role: decoded.role
            };
        } catch {
            return null;
        }
    }

    public isAuthenticated(): boolean {
        return !!this.getToken();
    }

    private get isBrowser(): boolean {
        return isPlatformBrowser(this.platformId);
    }
}
