import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models/auth.model';
import { UserRegistration, UserUpdate } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los usuarios
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<{ users: User[] }>(`${this.apiUrl}/users`)
      .pipe(
        map(response => response.users),
        catchError(error => {
          console.error('Error al obtener usuarios:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Obtiene un usuario por su ID
   */
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Error al obtener usuario con ID ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Obtiene un usuario por su nombre de usuario
   */
  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/username/${username}`)
      .pipe(
        catchError(error => {
          console.error(`Error al obtener usuario con username ${username}:`, error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Obtiene el usuario autenticado actualmente
   */
  getCurrentUser(): Observable<User> {
    return this.http.get<{ user: User }>(`${this.apiUrl}/auth/me`)
      .pipe(
        map(response => response.user),
        catchError(error => {
          console.error('Error al obtener usuario actual:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Registra un nuevo usuario
   */
  registerUser(userData: UserRegistration): Observable<User> {
    return this.http.post<{ message: string, user: User }>(`${this.apiUrl}/auth/register`, userData)
      .pipe(
        map(response => response.user),
        catchError(error => {
          console.error('Error al registrar usuario:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Actualiza un usuario existente
   */
  updateUser(id: string, userData: UserUpdate): Observable<User> {
    return this.http.put<{ message: string, user: User }>(`${this.apiUrl}/user/${id}`, userData)
      .pipe(
        map(response => response.user),
        catchError(error => {
          console.error(`Error al actualizar usuario con ID ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Elimina un usuario
   */
  deleteUser(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/user/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Error al eliminar usuario con ID ${id}:`, error);
          return throwError(() => error);
        })
      );
  }
}
