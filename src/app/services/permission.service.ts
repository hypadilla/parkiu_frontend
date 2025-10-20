import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  constructor(private authService: AuthService) {}

  /**
   * Verifica si el usuario actual tiene un permiso específico
   */
  hasPermission(permission: string): boolean {
    const currentUser = this.authService.currentUserValue;
    return currentUser?.permissions?.includes(permission) || false;
  }

  /**
   * Observable que emite true/false cuando cambia el estado de permisos
   */
  hasPermission$(permission: string): Observable<boolean> {
    return this.authService.currentUser.pipe(
      map(user => user?.permissions?.includes(permission) || false)
    );
  }

  /**
   * Verifica si el usuario tiene alguno de los permisos especificados
   */
  hasAnyPermission(permissions: string[]): boolean {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser?.permissions) return false;
    
    return permissions.some(permission => 
      currentUser.permissions.includes(permission)
    );
  }

  /**
   * Verifica si el usuario tiene todos los permisos especificados
   */
  hasAllPermissions(permissions: string[]): boolean {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser?.permissions) return false;
    
    return permissions.every(permission => 
      currentUser.permissions.includes(permission)
    );
  }

  /**
   * Obtiene el rol del usuario actual
   */
  getCurrentRole(): string | null {
    const currentUser = this.authService.currentUserValue;
    return currentUser?.role || null;
  }

  /**
   * Verifica si el usuario es admin
   */
  isAdmin(): boolean {
    return this.getCurrentRole() === 'admin';
  }

  /**
   * Verifica si el usuario es un usuario normal
   */
  isUser(): boolean {
    return this.getCurrentRole() === 'user';
  }

  /**
   * Verifica si el usuario es un dispositivo
   */
  isDevice(): boolean {
    return this.getCurrentRole() === 'device';
  }
}
