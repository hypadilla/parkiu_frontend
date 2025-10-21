import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ProfileModalComponent } from './components/profile-modal/profile-modal.component';
import { ReservationsComponent } from './components/reservations/reservations.component';
import { ParkingGridComponent } from './components/parking-grid/parking-grid.component';
import { ToastComponent } from './components/toast/toast.component';
import { DebugComponent } from './components/debug/debug.component';
import { HealthComponent } from './components/health/health.component';
import { HasPermissionPipe } from './pipes/has-permission.pipe';

// Servicios
import { AuthService } from './services/auth.service';
import { ParkingService } from './services/parking.service';
import { SocketService } from './services/socket.service';
import { PermissionService } from './services/permission.service';
import { OptimizedParkingService } from './services/optimized-parking.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ProfileModalComponent,
    ReservationsComponent,
    ParkingGridComponent,
    ToastComponent,
    DebugComponent,
    HealthComponent,
    HasPermissionPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
