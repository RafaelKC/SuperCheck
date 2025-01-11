import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, User } from '../interfaces/user.interface';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly API_URL = 'http://localhost:5277';
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    currentUser$ = this.currentUserSubject.asObservable();
    private platformId = inject(PLATFORM_ID);

    constructor(
        private http: HttpClient,
        private tokenService: TokenService,
        private router: Router
    ) {
        if (isPlatformBrowser(this.platformId)) {
            const user = this.tokenService.getUser();
            this.currentUserSubject.next(user);
        }
    }

    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials)
            .pipe(
                tap(response => {
                    this.tokenService.setToken(response.token);
                    const user = this.tokenService.getUser();
                    this.currentUserSubject.next(user);
                })
            );
    }

    logout(): void {
        this.tokenService.removeToken();
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    isAuthenticated(): boolean {
        return this.tokenService.isAuthenticated();
    }

    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }
}
