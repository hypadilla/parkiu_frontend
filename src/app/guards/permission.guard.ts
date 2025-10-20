import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const requiredPermission = route.data['permission'];
    
    if (!requiredPermission) {
      return true; // Si no se especifica permiso, permitir acceso
    }

    const currentUser = this.authService.currentUserValue;
    
    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    if (!currentUser.permissions || !currentUser.permissions.includes(requiredPermission)) {
      // Redirigir a una página de acceso denegado o al dashboard
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
