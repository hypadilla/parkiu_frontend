export interface ParkingCell {
  id: string;
  idStatic: string;
  state: ParkingCellState;
  createdDate?: Date;
  createdBy?: string;
  lastModifiedDate?: Date;
  lastModifiedBy?: string;
  reservationDetails?: ReservationDetails | null;
}

export type ParkingCellState = 'disponible' | 'ocupado' | 'reservado' | 'inhabilitado';

export interface ReservationDetails {
  userId: string;
  userName: string;
  startTime: Date;
  endTime?: Date;
  notes?: string;
}

export interface ReserveParkingCellRequest {
  state: 'reservado';
  reservationDetails: ReservationDetails;
}

export interface CancelReservationRequest {
  state: 'disponible';
}

export interface ParkingCellResponse {
  message: string;
  parkingCell: ParkingCell;
}

export interface ParkingCellsResponse {
  parkingCells: ParkingCell[];
}
