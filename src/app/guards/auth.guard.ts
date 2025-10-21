import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const currentUser = this.authService.currentUserValue;
    console.log('🔐 AuthGuard - currentUser:', currentUser);
    console.log('🔐 AuthGuard - route:', route.url);
    
    if (currentUser) {
      console.log('✅ AuthGuard - Usuario autenticado, permitiendo acceso');
      return true;
    }

    console.log('❌ AuthGuard - Usuario no autenticado, redirigiendo a login');
    this.router.navigate(['/login']);
    return false;
  }
}