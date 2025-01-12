import { Injectable, PLATFORM_ID, inject, Inject } from '@angular/core';
import { API_URL } from '../tokens/api.token';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, User } from '../interfaces/user.auth.interface';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();
    private platformId = inject(PLATFORM_ID);

    constructor(
        private http: HttpClient,
        private tokenService: TokenService,
        private router: Router,
        @Inject(API_URL) private readonly apiUrl: string
    ) {
        if (isPlatformBrowser(this.platformId)) {
            const user = this.tokenService.getUser();
            this.currentUserSubject.next(user);
        }
    }

    public login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
            .pipe(
                tap(response => {
                    this.tokenService.setToken(response.token);
                    const user = this.tokenService.getUser();
                    this.currentUserSubject.next(user);
                })
            );
    }

    public logout(): void {
        this.tokenService.removeToken();
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

  public isAuthenticated(): boolean {
    return !!this.tokenService.getToken();
  }

  public isSupervisor(): boolean {
    return this.hasRole('Supervisor');
  }

  public hasRole(role: string): boolean {
    const token = this.tokenService.getToken();
    if (!token) return false;
    
    const decodedToken = this.tokenService.decodeToken(token);
    return decodedToken?.role === role;
  }

    public getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }
}
