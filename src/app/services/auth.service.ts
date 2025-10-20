import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoginResponse, TokenResponse, TokenVerificationResponse, User } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private tokenKey = 'auth_token';
  private refreshTokenKey = 'refresh_token';
  private userKey = 'auth_user';
  private useSessionStorage = true;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { username, password })
      .pipe(
        tap(response => {
          this.setToken(response.token);
          if ((response as any).refreshToken) {
            this.setRefreshToken((response as any).refreshToken);
          }
          if (response.user) {
            this.setUser(response.user);
            this.currentUserSubject.next(response.user);
          }
        }),
        catchError(error => {
          console.error('Error en login:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): Observable<any> {
    const token = this.getToken();
    if (token) {
      const headers = { 'Authorization': `Bearer ${token}` };
      return this.http.post(`${this.apiUrl}/auth/logout`, {}, { headers })
        .pipe(
          tap(() => this.clearAuthData()),
          catchError(error => {
            this.clearAuthData();
            return throwError(() => error);
          })
        );
    } else {
      this.clearAuthData();
      return of({ message: 'Logout exitoso' });
    }
  }

  refreshToken(): Observable<TokenResponse> {
    const rToken = this.getRefreshToken();
    if (!rToken) {
      return throwError(() => new Error('No hay refresh token disponible'));
    }
    return this.http.post<TokenResponse>(`${this.apiUrl}/auth/refresh`, { refreshToken: rToken })
      .pipe(
        tap(response => {
          this.setToken(response.token);
          if ((response as any).refreshToken) {
            this.setRefreshToken((response as any).refreshToken);
          }
        }),
        catchError(error => {
          console.error('Error al refrescar token:', error);
          return throwError(() => error);
        })
      );
  }

  verifyToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) return of(false);
    return this.http.post<TokenVerificationResponse>(`${this.apiUrl}/auth/verify-token`, { token })
      .pipe(
        map((res: TokenVerificationResponse) => !!res.valid),
        catchError(() => {
          this.clearAuthData();
          return of(false);
        })
      );
  }

  getToken(): string | null {
    return this.useSessionStorage ? sessionStorage.getItem(this.tokenKey) : localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    if (this.useSessionStorage) sessionStorage.setItem(this.tokenKey, token);
    else localStorage.setItem(this.tokenKey, token);
  }

  private setRefreshToken(token: string): void {
    if (this.useSessionStorage) sessionStorage.setItem(this.refreshTokenKey, token);
    else localStorage.setItem(this.refreshTokenKey, token);
  }

  getRefreshToken(): string | null {
    return this.useSessionStorage ? sessionStorage.getItem(this.refreshTokenKey) : localStorage.getItem(this.refreshTokenKey);
  }

  private setUser(user: User): void {
    const str = JSON.stringify(user);
    if (this.useSessionStorage) sessionStorage.setItem(this.userKey, str);
    else localStorage.setItem(this.userKey, str);
  }

  private getUserFromStorage(): User | null {
    const str = this.useSessionStorage ? sessionStorage.getItem(this.userKey) : localStorage.getItem(this.userKey);
    if (!str) return null;
    try { return JSON.parse(str) as User; } catch { return null; }
  }

  private clearAuthData(): void {
    if (this.useSessionStorage) {
      sessionStorage.removeItem(this.tokenKey);
      sessionStorage.removeItem(this.refreshTokenKey);
      sessionStorage.removeItem(this.userKey);
    } else {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.refreshTokenKey);
      localStorage.removeItem(this.userKey);
    }
    this.currentUserSubject.next(null);
  }
}
