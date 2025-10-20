import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';
import { AuthService } from '../../services/auth.service';
import { ParkingService } from '../../services/parking.service';
import { OptimizedParkingService } from '../../services/optimized-parking.service';
import { PermissionService } from '../../services/permission.service';
import { User } from '../../models/auth.model';
import { ParkingStatus, ParkingRecommendation, ParkingSpace } from '../../models/parking.model';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  loading = false;
  parkingStatus: ParkingStatus | null = null;
  parkingSpaces: ParkingSpace[] = [];
  recommendations: ParkingRecommendation[] = [];
  recommendationText: string = '';
  lastUpdateText: string = '';
  notifications: string[] = [];
  private statusSubscription: Subscription | null = null;
  private refreshInterval: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private parkingService: ParkingService,
    private optimizedParkingService: OptimizedParkingService,
    private permissionService: PermissionService,
    private router: Router,
    private modalService: NgbModal,
    private socketService: SocketService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
    
    // Cargar datos iniciales
    this.loadParkingData();

    // Conectar Socket.IO y suscribirse a eventos en tiempo real
    this.socketService.connect();
    this.socketService.on('parkingCellsUpdate').subscribe((payload: any) => {
      if (payload?.data) {
        const mapById: Record<string, ParkingSpace> = {};
        for (const p of this.parkingSpaces) {
          mapById[String((p as any).idStatic ?? p.id)] = p;
        }
        for (const updated of payload.data) {
          const key = String(updated.idStatic ?? updated.id ?? updated.parquederoid);
          mapById[key] = {
            id: key,
            numero: key,
            estado: String(updated.state ?? updated.Estado ?? '').toLowerCase(),
            ubicacion: 'Sector General',
            ultimaActualizacion: new Date()
          };
        }
        this.parkingSpaces = Object.values(mapById);
        this.recomputeKpisFromSpaces();
      }
    });
    this.socketService.on('statisticsUpdated').subscribe((stats: any) => {
      if (stats) {
        this.parkingStatus = {
          disponibles: stats.available ?? 0,
          ocupados: stats.occupied ?? 0,
          reservados: stats.reserved ?? 0,
          inhabilitados: stats.disabled ?? 0,
          lastUpdate: new Date()
        };
        this.updateLastUpdateText();
      }
    });

    // Actualización puntual de una celda
    this.socketService.on('parkingCellUpdated').subscribe((payload: any) => {
      const updated = payload?.data;
      if (!updated) return;
      const key = String(updated.idStatic ?? updated.id ?? updated.parquederoid);
      const idx = this.parkingSpaces.findIndex(p => String((p as any).idStatic ?? p.id) === key);
      const updatedSpace: ParkingSpace = {
        id: key,
        numero: key,
        estado: String(updated.state ?? updated.Estado ?? '').toLowerCase(),
        ubicacion: 'Sector General',
        ultimaActualizacion: new Date()
      };
      if (idx >= 0) {
        this.parkingSpaces[idx] = updatedSpace;
      } else {
        this.parkingSpaces = [...this.parkingSpaces, updatedSpace];
      }
      this.notifications.unshift(`Celda ${key} ahora está ${updatedSpace.estado}`);
      this.recomputeKpisFromSpaces();
    });

    // Notificaciones generales
    this.socketService.on('notification').subscribe((n: any) => {
      const msg = n?.message ? String(n.message) : 'Notificación del sistema';
      this.notifications.unshift(msg);
      console.info('Notificación:', msg);
    });

    // Reserva creada
    this.socketService.on('parkingCellReserved').subscribe((payload: any) => {
      const updated = payload?.data;
      const reservation = payload?.reservation;
      if (!updated) return;
      const key = String(updated.idStatic ?? updated.id ?? updated.parquederoid);
      const idx = this.parkingSpaces.findIndex(p => String((p as any).idStatic ?? p.id) === key);
      const updatedSpace: ParkingSpace = {
        id: key,
        numero: key,
        estado: String(updated.state ?? updated.Estado ?? 'reservado').toLowerCase(),
        ubicacion: 'Sector General',
        ultimaActualizacion: new Date()
      };
      if (idx >= 0) {
        this.parkingSpaces[idx] = updatedSpace;
      } else {
        this.parkingSpaces = [...this.parkingSpaces, updatedSpace];
      }
      const reservedBy = reservation?.reservedBy ? ` por ${reservation.reservedBy}` : '';
      this.notifications.unshift(`Celda ${key} reservada${reservedBy}`);
      this.recomputeKpisFromSpaces();
    });

    // Reserva cancelada
    this.socketService.on('parkingCellReservationCancelled').subscribe((payload: any) => {
      const updated = payload?.data;
      if (!updated) return;
      const key = String(updated.idStatic ?? updated.id ?? updated.parquederoid);
      const idx = this.parkingSpaces.findIndex(p => String((p as any).idStatic ?? p.id) === key);
      const updatedSpace: ParkingSpace = {
        id: key,
        numero: key,
        estado: String(updated.state ?? updated.Estado ?? 'disponible').toLowerCase(),
        ubicacion: 'Sector General',
        ultimaActualizacion: new Date()
      };
      if (idx >= 0) {
        this.parkingSpaces[idx] = updatedSpace;
      } else {
        this.parkingSpaces = [...this.parkingSpaces, updatedSpace];
      }
      this.notifications.unshift(`Reserva cancelada en celda ${key}`);
      this.recomputeKpisFromSpaces();
    });

    // Fallback: actualización cada 5 minutos
    this.refreshInterval = interval(300000).subscribe(() => this.loadParkingData());
  }
  
  ngOnDestroy(): void {
    if (this.statusSubscription) this.statusSubscription.unsubscribe();
    if (this.refreshInterval) this.refreshInterval.unsubscribe();
  }
  
  loadParkingData(): void {
    this.statusSubscription = this.optimizedParkingService.getParkingStatusSummary().subscribe(status => {
      this.parkingStatus = status;
      this.updateLastUpdateText();
    });
    
    this.optimizedParkingService.getParkingStatus().subscribe(response => {
      this.parkingSpaces = response.parqueaderos;
      this.recomputeKpisFromSpaces();
    });

    this.optimizedParkingService.getTodayRecommendations().subscribe(recommendations => {
      this.recommendations = recommendations;
      this.updateRecommendationText();
    });
  }
  
  private recomputeKpisFromSpaces(): void {
    // Recalcular KPIs localmente basado en this.parkingSpaces
    const disponibles = this.parkingSpaces.filter(p => p.estado === 'disponible').length;
    const ocupados = this.parkingSpaces.filter(p => p.estado === 'ocupado').length;
    const reservados = this.parkingSpaces.filter(p => p.estado === 'reservado').length;
    const inhabilitados = this.parkingSpaces.filter(p => p.estado === 'inhabilitado').length;
    this.parkingStatus = {
      disponibles,
      ocupados,
      reservados,
      inhabilitados,
      lastUpdate: new Date()
    };
    this.updateLastUpdateText();
  }

  updateLastUpdateText(): void {
    if (!this.parkingStatus?.lastUpdate) return;
    const now = new Date();
    const lastUpdate = new Date(this.parkingStatus.lastUpdate);
    const diffMs = now.getTime() - lastUpdate.getTime();
    const diffMins = Math.round(diffMs / 60000);
    if (diffMins < 1) this.lastUpdateText = 'Actualizado hace unos segundos';
    else if (diffMins === 1) this.lastUpdateText = 'Actualizado hace 1 minuto';
    else this.lastUpdateText = `Actualizado hace ${diffMins} minutos`;
  }

  updateRecommendationText(): void {
    if (this.recommendations.length > 0) {
      this.recommendationText = this.recommendations.map(r => r.horasRecomendadas).join(', ');
    } else {
      this.recommendationText = '¡Consulta las mejores horas de estacionamiento hoy!';
    }
  }

  openProfileModal(): void {
    const modalRef = this.modalService.open(ProfileModalComponent, { centered: true, size: 'lg' });
    if (this.currentUser?.id) {
      (modalRef.componentInstance as any).userId = this.currentUser.id;
    }
  }
  
  onParkingSpaceClick(space: ParkingSpace): void {
    console.log('Celda seleccionada:', space);
  }
  
  logout(): void {
    this.loading = true;
    this.authService.logout().subscribe({
      next: () => { this.router.navigate(['/login']); },
      error: _ => { this.loading = false; },
      complete: () => { this.loading = false; }
    });
  }
}
