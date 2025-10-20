export interface ParkingStatus {
  disponibles: number;
  ocupados: number;
  reservados: number;
  inhabilitados: number;
  lastUpdate: Date;
}

export interface ParkingRecommendation {
  dia: string;
  horasRecomendadas: string;
}

export interface BackendRecommendation {
  message: string;
  priority: number;
  type: string;
}

export interface ParkingSpace {
  id: string;
  numero: string;
  estado: string; // 'disponible', 'ocupado', 'reservado', 'inhabilitado'
  ubicacion: string;
  ultimaActualizacion: Date;
}

export interface BackendParkingCell {
  id: string;
  idStatic: number;
  state: string;
}

export interface BackendDashboardResponse {
  Parqueaderos: BackendParkingCell[];
  Recomendaciones: BackendRecommendation[];
}

export interface ParkingResponse {
  parqueaderos: ParkingSpace[];
  recomendaciones: ParkingRecommendation[];
}
