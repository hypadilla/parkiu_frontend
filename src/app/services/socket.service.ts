import { Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { PermissionService } from './permission.service';

@Injectable({ providedIn: 'root' })
export class SocketService implements OnDestroy {
  private socket: Socket | null = null;
  private connected$ = new Subject<boolean>();
  private subscribedEvents$ = new BehaviorSubject<Set<string>>(new Set());

  constructor(private permissionService: PermissionService) {}

  connect(): void {
    if (this.socket) return;
    this.socket = io(environment.wsUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true
    });

    this.socket.on('connect', () => {
      this.connected$.next(true);
      this.subscribeToRelevantEvents();
    });

    this.socket.on('disconnect', () => {
      this.connected$.next(false);
    });
  }

  /**
   * Suscribe solo a eventos relevantes según los permisos del usuario
   */
  private subscribeToRelevantEvents(): void {
    if (!this.socket) return;

    // Eventos básicos que todos pueden recibir
    this.subscribeToEvent('heartbeat');
    this.subscribeToEvent('notification');

    // Eventos de parqueaderos - solo si tiene permisos
    if (this.permissionService.hasPermission('CAN_VIEW_PARKING_CELLS')) {
      this.subscribeToEvent('parkingCellsUpdate');
      this.subscribeToEvent('parkingCellUpdated');
      this.subscribeToEvent('parkingCellStatusChanged');
      this.subscribeToEvent('parkingCellReserved');
      this.subscribeToEvent('parkingCellReservationCancelled');
    }

    // Estadísticas - solo si puede ver dashboard
    if (this.permissionService.hasPermission('CAN_VIEW_DASHBOARD')) {
      this.subscribeToEvent('statisticsUpdated');
    }

    // Notificar al servidor que estamos suscritos
    this.socket.emit('subscribeToParkingCells');
  }

  private subscribeToEvent(event: string): void {
    if (!this.socket) return;
    
    const currentSubscriptions = this.subscribedEvents$.value;
    if (!currentSubscriptions.has(event)) {
      this.socket.on(event, (data) => {
        // Emitir evento a través del observable
        this.eventSubjects.get(event)?.next(data);
      });
      
      currentSubscriptions.add(event);
      this.subscribedEvents$.next(new Set(currentSubscriptions));
    }
  }

  private eventSubjects = new Map<string, Subject<any>>();

  onConnected(): Observable<boolean> {
    return this.connected$.asObservable();
  }

  on<T = any>(event: string): Observable<T> {
    if (!this.eventSubjects.has(event)) {
      this.eventSubjects.set(event, new Subject<T>());
    }
    return this.eventSubjects.get(event)!.asObservable();
  }

  emit(event: string, payload?: any): void {
    this.socket?.emit(event, payload);
  }

  /**
   * Verifica si está suscrito a un evento específico
   */
  isSubscribedTo(event: string): boolean {
    return this.subscribedEvents$.value.has(event);
  }

  /**
   * Obtiene lista de eventos suscritos
   */
  getSubscribedEvents(): string[] {
    return Array.from(this.subscribedEvents$.value);
  }

  ngOnDestroy(): void {
    this.socket?.disconnect();
    this.socket = null;
    this.eventSubjects.forEach(subject => subject.complete());
    this.eventSubjects.clear();
  }
}


