import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { 
  ParkingCell, 
  ParkingCellsResponse, 
  ParkingCellResponse, 
  ReserveParkingCellRequest,
  CancelReservationRequest
} from '../models/parking-cell.model';

@Injectable({
  providedIn: 'root'
})
export class ParkingCellService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todas las celdas de estacionamiento
   */
  getAllParkingCells(): Observable<ParkingCell[]> {
    return this.http.get<ParkingCell[]>(`${this.apiUrl}/parking-cells`)
      .pipe(
        catchError(error => {
          console.error('Error al obtener celdas de estacionamiento:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Reserva una celda de estacionamiento
   * @param idStatic ID estático de la celda a reservar (número de celda)
   * @param reservationDetails Datos de la reserva
   */
  reserveParkingCell(idStatic: string, reservedBy: string, startTime: Date, endTime: Date | undefined, reason: string): Observable<any> {
    const body = {
      state: 'reservado',
      reservationDetails: {
        reservedBy: reservedBy,
        startTime: startTime.toISOString(),
        endTime: endTime ? endTime.toISOString() : new Date(startTime.getTime() + 3600000).toISOString(), // 1 hora por defecto
        reason: reason
      }
    };
    
    return this.http.put(`${this.apiUrl}/parking-cells/${idStatic}/status`, body)
      .pipe(
        catchError(error => {
          console.error(`Error al reservar celda ${idStatic}:`, error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Cancela la reserva de una celda de estacionamiento
   * @param idStatic ID estático de la celda cuya reserva se va a cancelar
   */
  cancelReservation(idStatic: string): Observable<any> {
    const body = {
      state: 'disponible',
      reservationDetails: null
    };
    
    return this.http.put(`${this.apiUrl}/parking-cells/${idStatic}/status`, body)
      .pipe(
        catchError(error => {
          console.error(`Error al cancelar reserva de celda ${idStatic}:`, error);
          return throwError(() => error);
        })
      );
  }
}
