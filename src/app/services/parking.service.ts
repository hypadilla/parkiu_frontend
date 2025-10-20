import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
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
export class ParkingService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene el estado actual de todos los espacios de estacionamiento
   */
  getParkingStatus(): Observable<ParkingResponse> {
    return this.http.get<BackendDashboardResponse>(`${this.apiUrl}/dashboard`)
      .pipe(
        map(response => {
          // Transformar la respuesta del backend al formato que espera nuestra aplicación
          const parqueaderos = this.transformParkingCells(response.Parqueaderos);
          const recomendaciones = this.transformRecommendations(response.Recomendaciones);
          
          return { parqueaderos, recomendaciones };
        }),
        catchError(error => {
          console.error('Error al obtener estado de estacionamientos:', error);
          // Devolver datos de ejemplo en caso de error
          return of(this.getMockParkingData());
        })
      );
  }
  
  /**
   * Transforma las celdas de estacionamiento del formato del backend al formato de la aplicación
   */
  private transformParkingCells(cells: BackendParkingCell[]): ParkingSpace[] {
    return cells.map(cell => ({
      id: String(cell.idStatic ?? cell.id),
      numero: String(cell.idStatic ?? cell.id),
      estado: (cell.state || '').toLowerCase(),
      ubicacion: 'Sector General',
      ultimaActualizacion: new Date()
    }));
  }
  
  /**
   * Transforma las recomendaciones del formato del backend al formato de la aplicación
   */
  private transformRecommendations(recommendations: BackendRecommendation[]): ParkingRecommendation[] {
    return recommendations.map(rec => ({
      dia: 'general',
      horasRecomendadas: `${rec.message} (prioridad ${rec.priority})`
    }));
  }

  /**
   * Obtiene un resumen del estado de los estacionamientos
   */
  getParkingStatusSummary(): Observable<ParkingStatus> {
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
        };
      })
    );
  }

  /**
   * Obtiene las recomendaciones para el día actual
   */
  getTodayRecommendations(): Observable<ParkingRecommendation[]> {
    return this.getRecommendations().pipe(
      map(recommendations => {
        const today = new Date();
        const dayOfWeek = this.getDayOfWeek(today.getDay());
        
        // Filtrar por el día actual y convertir al formato esperado
        return recommendations
          .filter(rec => rec.dia.toLowerCase() === dayOfWeek.toLowerCase());
      })
    );
  }
  
  /**
   * Obtiene todas las recomendaciones directamente del endpoint /recommendations
   */
  getRecommendations(): Observable<ParkingRecommendation[]> {
    return this.http.get<BackendRecommendation[]>(`${this.apiUrl}/recommendations`)
      .pipe(
        map(response => this.transformRecommendations(response)),
        catchError(error => {
          console.error('Error al obtener recomendaciones:', error);
          return of(this.getMockRecommendations());
        })
      );
  }
  
  /**
   * Formatea un array de horas en un string legible
   */
  private formatHours(hours: string[]): string {
    if (!hours || hours.length === 0) return 'No hay horas recomendadas';
    
    // Agrupar horas consecutivas
    const groups: string[][] = [];
    let currentGroup: string[] = [hours[0]];
    
    for (let i = 1; i < hours.length; i++) {
      const currentHour = parseInt(hours[i].split(':')[0]);
      const prevHour = parseInt(hours[i-1].split(':')[0]);
      
      if (currentHour === prevHour + 1) {
        currentGroup.push(hours[i]);
      } else {
        groups.push([...currentGroup]);
        currentGroup = [hours[i]];
      }
    }
    
    groups.push(currentGroup);
    
    // Formatear cada grupo
    const formattedGroups = groups.map(group => {
      if (group.length === 1) {
        return group[0];
      } else {
        return `${group[0]} a ${group[group.length - 1]}`;
      }
    });
    
    return formattedGroups.join(', ');
  }

  /**
   * Convierte el número de día a nombre en español
   */
  private getDayOfWeek(day: number): string {
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    return days[day];
  }

  /**
   * Obtiene recomendaciones de ejemplo
   */
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
  
  /**
   * Datos de ejemplo para usar cuando no hay conexión al backend
   */
  private getMockParkingData(): ParkingResponse {
    const parqueaderos = [];
    
    // Crear 87 espacios de estacionamiento de ejemplo
    for (let i = 1; i <= 87; i++) {
      let estado;
      if (i <= 42) estado = 'disponible';
      else if (i <= 70) estado = 'ocupado';
      else if (i <= 82) estado = 'reservado';
      else estado = 'inhabilitado';
      
      parqueaderos.push({
        id: `park-${i}`,
        numero: `P${i}`,
        estado: estado,
        ubicacion: `Sector ${Math.ceil(i/20)}`,
        ultimaActualizacion: new Date()
      });
    }
    
    const recomendaciones = [
      { dia: 'lunes', horasRecomendadas: '7:00 AM a 9:00 AM, 4:00 PM a 6:00 PM' },
      { dia: 'martes', horasRecomendadas: '8:00 AM a 10:00 AM, 3:00 PM a 5:00 PM' },
      { dia: 'miércoles', horasRecomendadas: '7:30 AM a 9:30 AM, 2:00 PM a 4:00 PM' },
      { dia: 'jueves', horasRecomendadas: '8:30 AM a 10:30 AM, 3:30 PM a 5:30 PM' },
      { dia: 'viernes', horasRecomendadas: '9:00 AM a 11:00 AM, 2:30 PM a 4:30 PM' },
      { dia: 'sábado', horasRecomendadas: '10:00 AM a 12:00 PM' },
      { dia: 'domingo', horasRecomendadas: '11:00 AM a 1:00 PM' }
    ];
    
    return { parqueaderos, recomendaciones };
  }
}
