import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ReservationsComponent } from './components/reservations/reservations.component';
import { HealthComponent } from './components/health/health.component';
import { AuthGuard } from './guards/auth.guard';
import { PermissionGuard } from './guards/permission.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'health', component: HealthComponent }, // Ruta pública para health check
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  {
    path: 'users',
    loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule),
    canActivate: [AuthGuard, PermissionGuard],
    data: { permission: 'CAN_VIEW_USERS' }
  },
  {
    path: 'reports',
    loadChildren: () => import('./modules/reports/reports.module').then(m => m.ReportsModule),
    canActivate: [AuthGuard, PermissionGuard],
    data: { permission: 'CAN_VIEW_DASHBOARD' }
  },
  {
    path: 'reservations',
    component: ReservationsComponent,
    canActivate: [AuthGuard]
  },
  // Ruta comodín - redirige a la página principal
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
