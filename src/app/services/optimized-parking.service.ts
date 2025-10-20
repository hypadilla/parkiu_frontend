import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { PermissionService } from './permission.service';
import { 
  ParkingResponse, 
  ParkingStatus, 
  ParkingRecommendation, 
  BackendRecommendation,
  BackendDashboardResponse,
  BackendParkingCell,
  ParkingSpace
} from '../models/parking.model';

@Injectable({
  providedIn: 'root'
})
export class OptimizedParkingService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient,
    private permissionService: PermissionService
  ) { }

  getParkingStatus(): Observable<ParkingResponse> {
    if (!this.permissionService.hasPermission('CAN_VIEW_PARKING_CELLS')) {
      return of({ parqueaderos: [], recomendaciones: [] });
    }

    return this.http.get<BackendDashboardResponse | any>(`${this.apiUrl}/dashboard`)
      .pipe(
        map((response: any) => {
          const rawCells: BackendParkingCell[] = Array.isArray(response?.Parqueaderos) ? response.Parqueaderos : (Array.isArray(response?.cells) ? response.cells : []);
          const rawRecs: BackendRecommendation[] = Array.isArray(response?.Recomendaciones) ? response.Recomendaciones : (Array.isArray(response?.recommendations) ? response.recommendations : []);
          const parqueaderos = this.transformParkingCells(rawCells);
          const recomendaciones = this.transformRecommendations(rawRecs);
          return { parqueaderos, recomendaciones } as ParkingResponse;
        }),
        catchError(error => {
          console.error('Error al obtener estado de estacionamientos:', error);
          return of(this.getMockParkingData());
        })
      );
  }

  getParkingStatusSummary(): Observable<ParkingStatus> {
    if (!this.permissionService.hasPermission('CAN_VIEW_PARKING_CELLS')) {
      return of({
        disponibles: 0,
        ocupados: 0,
        reservados: 0,
        inhabilitados: 0,
        lastUpdate: new Date()
      });
    }

    return this.getParkingStatus().pipe(
      map(response => {
        const disponibles = response.parqueaderos.filter(p => p.estado === 'disponible').length;
        const ocupados = response.parqueaderos.filter(p => p.estado === 'ocupado').length;
        const reservados = response.parqueaderos.filter(p => p.estado === 'reservado').length;
        const inhabilitados = response.parqueaderos.filter(p => p.estado === 'inhabilitado').length;
        
        return {
          disponibles,
          ocupados,
          reservados,
          inhabilitados,
          lastUpdate: new Date()
        } as ParkingStatus;
      })
    );
  }

  getTodayRecommendations(): Observable<ParkingRecommendation[]> {
    if (!this.permissionService.hasPermission('CAN_VIEW_RECOMMENDATIONS')) {
      return of([]);
    }

    return this.getRecommendations().pipe(
      map(recommendations => {
        const today = new Date();
        const dayOfWeek = this.getDayOfWeek(today.getDay());
        
        return (recommendations || [])
          .filter(rec => (rec.dia || '').toLowerCase() === dayOfWeek.toLowerCase());
      })
    );
  }
  
  getRecommendations(): Observable<ParkingRecommendation[]> {
    if (!this.permissionService.hasPermission('CAN_VIEW_RECOMMENDATIONS')) {
      return of([]);
    }

    return this.http.get<any>(`${this.apiUrl}/recommendations`)
      .pipe(
        map((response: any) => {
          const raw: BackendRecommendation[] = Array.isArray(response)
            ? response
            : (Array.isArray(response?.data) ? response.data : (Array.isArray(response?.recommendations) ? response.recommendations : []));
          return this.transformRecommendations(raw);
        }),
        catchError(error => {
          console.error('Error al obtener recomendaciones:', error);
          return of([]);
        })
      );
  }

  private transformParkingCells(cells: BackendParkingCell[] | any[]): ParkingSpace[] {
    if (!Array.isArray(cells)) return [];
    return cells.map(cell => {
      const anyCell: any = cell as any;
      const idVal = anyCell.idStatic ?? anyCell.id ?? anyCell.parquederoid ?? '';
      const stateVal = (anyCell.state ?? anyCell.Estado ?? '').toString().toLowerCase().trim();
      return {
        id: String(idVal),
        numero: String(idVal),
        estado: stateVal,
        ubicacion: 'Sector General',
        ultimaActualizacion: new Date()
      } as ParkingSpace;
    });
  }
  
  private transformRecommendations(recommendations: BackendRecommendation[] | any[]): ParkingRecommendation[] {
    if (!Array.isArray(recommendations)) return [];
    return recommendations.map(rec => ({
      dia: 'general',
      horasRecomendadas: `${(rec as any).message ?? ''}${(rec as any).priority != null ? ` (prioridad ${(rec as any).priority})` : ''}`.trim()
    }));
  }

  private getDayOfWeek(day: number): string {
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    return days[day];
  }

  private getMockRecommendations(): ParkingRecommendation[] {
    return [
      { dia: 'lunes', horasRecomendadas: '07:00 a 09:00, 16:00 a 18:00' },
      { dia: 'martes', horasRecomendadas: '08:00 a 10:00, 15:00 a 17:00' },
      { dia: 'miércoles', horasRecomendadas: '07:30 a 09:30, 14:00 a 16:00' },
      { dia: 'jueves', horasRecomendadas: '08:30 a 10:30, 15:30 a 17:30' },
      { dia: 'viernes', horasRecomendadas: '09:00 a 11:00, 14:30 a 16:30' },
      { dia: 'sábado', horasRecomendadas: '10:00 a 12:00' },
      { dia: 'domingo', horasRecomendadas: '11:00 a 13:00' }
    ];
  }
  
  private getMockParkingData(): ParkingResponse {
    return { parqueaderos: [], recomendaciones: [] };
  }
}
