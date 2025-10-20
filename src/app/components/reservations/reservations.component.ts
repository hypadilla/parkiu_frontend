import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ParkingService } from '../../services/parking.service';
import { ParkingCellService } from '../../services/parking-cell.service';
import { AuthService } from '../../services/auth.service';
import { ParkingSpace } from '../../models/parking.model';
import { User } from '../../models/auth.model';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements OnInit {
  allParkingSpaces: ParkingSpace[] = [];
  availableCells: ParkingSpace[] = [];
  myReservations: ParkingSpace[] = [];
  currentUser: User | null = null;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  reservationForm: FormGroup;
  selectedCell: ParkingSpace | null = null;
  showReservationModal = false;

  constructor(
    private parkingService: ParkingService,
    private parkingCellService: ParkingCellService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.reservationForm = this.fb.group({
      startTime: ['', Validators.required],
      endTime: [''],
      reason: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadParkingData();
  }

  loadCurrentUser(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.filterMyReservations();
      }
    });
  }

  loadParkingData(): void {
    this.loading = true;
    this.error = null;

    this.parkingService.getParkingStatus().subscribe({
      next: (response) => {
        this.allParkingSpaces = response.parqueaderos;
        this.availableCells = response.parqueaderos.filter(cell => cell.estado === 'disponible');
        this.filterMyReservations();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar datos de estacionamiento:', error);
        this.error = 'No se pudieron cargar los datos de estacionamiento. Por favor, inténtelo de nuevo más tarde.';
        this.loading = false;
      }
    });
  }

  filterMyReservations(): void {
    if (this.currentUser) {
      // TODO: Filtrar reservas del usuario actual cuando el backend proporcione esta información
      this.myReservations = this.allParkingSpaces.filter(cell => cell.estado === 'reservado');
    }
  }

  onParkingSpaceClick(space: ParkingSpace): void {
    if (space.estado === 'disponible') {
      const cellToReserve = this.availableCells.find(c => c.id === space.id);
      if (cellToReserve) {
        this.openReservationModal(cellToReserve);
      }
    } else if (space.estado === 'reservado') {
      // Mostrar información de la reserva
      console.log('Reserva:', space);
    }
  }

  openReservationModal(cell: ParkingSpace): void {
    this.selectedCell = cell;
    this.reservationForm.reset();
    
    // Establecer la hora de inicio predeterminada (ahora)
    const now = new Date();
    const formattedDate = now.toISOString().substring(0, 16); // Formato YYYY-MM-DDTHH:MM
    this.reservationForm.get('startTime')?.setValue(formattedDate);
    
    this.showReservationModal = true;
  }

  closeReservationModal(): void {
    this.showReservationModal = false;
    this.selectedCell = null;
  }

  submitReservation(): void {
    if (!this.reservationForm.valid || !this.selectedCell || !this.currentUser) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    const formValues = this.reservationForm.value;
    const startTime = new Date(formValues.startTime);
    const endTime = formValues.endTime ? new Date(formValues.endTime) : undefined;
    
    // Llamada real al backend
    this.parkingCellService.reserveParkingCell(
      this.selectedCell.numero, // idStatic
      this.currentUser.id || this.currentUser.username, // reservedBy
      startTime,
      endTime,
      formValues.reason
    ).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = `Celda ${this.selectedCell?.numero} reservada exitosamente.`;
        this.closeReservationModal();
        this.loadParkingData();
      },
      error: (error) => {
        console.error('Error al reservar celda:', error);
        this.error = error.error?.message || 'No se pudo completar la reserva. Por favor, inténtelo de nuevo.';
        this.loading = false;
      }
    });
  }

  cancelReservation(cell: ParkingSpace): void {
    if (!confirm(`¿Está seguro de que desea cancelar la reserva de la celda ${cell.numero}?`)) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    // Llamada real al backend
    this.parkingCellService.cancelReservation(cell.numero).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = `Reserva de celda ${cell.numero} cancelada exitosamente.`;
        this.loadParkingData();
      },
      error: (error) => {
        console.error('Error al cancelar reserva:', error);
        this.error = error.error?.message || 'No se pudo cancelar la reserva. Por favor, inténtelo de nuevo.';
        this.loading = false;
      }
    });
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'No especificada';
    return new Date(date).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
