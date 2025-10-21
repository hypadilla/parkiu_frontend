import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-health',
  template: `
    <div class="health-container">
      <div class="health-card">
        <h2>🏥 Health Check</h2>
        <div class="health-info">
          <div class="info-item">
            <strong>Status:</strong> 
            <span class="status healthy">✅ Healthy</span>
          </div>
          <div class="info-item">
            <strong>Version:</strong> 
            <span class="version">{{ version }}</span>
          </div>
          <div class="info-item">
            <strong>Environment:</strong> 
            <span class="environment">{{ environment }}</span>
          </div>
          <div class="info-item">
            <strong>API URL:</strong> 
            <span class="api-url">{{ apiUrl }}</span>
          </div>
          <div class="info-item">
            <strong>WebSocket URL:</strong> 
            <span class="ws-url">{{ wsUrl }}</span>
          </div>
          <div class="info-item">
            <strong>Build Time:</strong> 
            <span class="build-time">{{ buildTime }}</span>
          </div>
          <div class="info-item">
            <strong>Last Deploy:</strong> 
            <span class="deploy-time">{{ deployTime }}</span>
          </div>
        </div>
        <div class="health-actions">
          <button class="btn btn-primary" (click)="refreshHealth()">
            🔄 Refresh
          </button>
          <button class="btn btn-secondary" (click)="goHome()">
            🏠 Go Home
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .health-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .health-card {
      background: white;
      border-radius: 15px;
      padding: 30px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      max-width: 600px;
      width: 100%;
    }

    .health-card h2 {
      text-align: center;
      margin-bottom: 25px;
      color: #333;
      font-size: 2rem;
    }

    .health-info {
      margin-bottom: 25px;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }

    .info-item:last-child {
      border-bottom: none;
    }

    .info-item strong {
      color: #555;
      font-weight: 600;
    }

    .status.healthy {
      color: #28a745;
      font-weight: bold;
    }

    .version {
      background: #007bff;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-family: monospace;
    }

    .environment {
      background: #6c757d;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      font-size: 0.8rem;
    }

    .api-url, .ws-url {
      font-family: monospace;
      background: #f8f9fa;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.9rem;
      word-break: break-all;
    }

    .build-time, .deploy-time {
      font-family: monospace;
      color: #666;
    }

    .health-actions {
      display: flex;
      gap: 10px;
      justify-content: center;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background: #0056b3;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #545b62;
    }

    @media (max-width: 768px) {
      .health-container {
        padding: 10px;
      }
      
      .health-card {
        padding: 20px;
      }
      
      .info-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
      }
      
      .health-actions {
        flex-direction: column;
      }
    }
  `]
})
export class HealthComponent implements OnInit {
  version = '1.0.0';
  environment = environment.production ? 'production' : 'development';
  apiUrl = environment.apiUrl;
  wsUrl = environment.wsUrl;
  buildTime = new Date().toISOString();
  deployTime = new Date().toISOString();

  constructor() { }

  ngOnInit(): void {
    // Simular tiempo de build (en producción sería el tiempo real)
    this.buildTime = new Date().toISOString();
    this.deployTime = new Date().toISOString();
  }

  refreshHealth(): void {
    // Actualizar timestamps
    this.buildTime = new Date().toISOString();
    this.deployTime = new Date().toISOString();
    
    // Aquí podrías agregar lógica para verificar conectividad
    console.log('Health check refreshed');
  }

  goHome(): void {
    // Navegar al home
    window.location.href = '/';
  }
}
