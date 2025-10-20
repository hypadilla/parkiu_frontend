import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-reports-home',
  templateUrl: './reports-home.component.html',
  styleUrls: ['./reports-home.component.scss']
})
export class ReportsHomeComponent implements OnInit {
  loading = true;
  error: string | null = null;

  disponibles = 0;
  ocupados = 0;
  reservados = 0;
  inhabilitados = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>(`${environment.apiUrl}/dashboard`).subscribe({
      next: (data) => {
        // data.Parqueaderos es un array con Estado
        const cells: Array<{ Estado: string }> = data?.Parqueaderos || [];
        this.disponibles = cells.filter(c => (c.Estado || '').toLowerCase() === 'disponible').length;
        this.ocupados = cells.filter(c => (c.Estado || '').toLowerCase() === 'ocupado').length;
        this.reservados = cells.filter(c => (c.Estado || '').toLowerCase() === 'reservado').length;
        this.inhabilitados = cells.filter(c => (c.Estado || '').toLowerCase() === 'inhabilitado').length;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se pudo cargar el dashboard';
        this.loading = false;
      }
    });
  }
}
