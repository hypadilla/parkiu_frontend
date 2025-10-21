import { Component } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Parkiu - Sistema de Gestión de Estacionamientos';
  environment = environment;
  currentTime = new Date().toISOString();
}
