import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PermissionService } from '../../services/permission.service';
import { SocketService } from '../../services/socket.service';
import { User } from '../../models/auth.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  userPermissions: string[] = [];
  subscribedEvents: string[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private permissionService: PermissionService,
    private socketService: SocketService
  ) { }

  ngOnInit(): void {
    // Suscribirse a cambios del usuario
    this.subscriptions.push(
      this.authService.currentUser.subscribe(user => {
        this.currentUser = user;
        this.userPermissions = user?.permissions || [];
      })
    );

    // Obtener eventos suscritos del socket
    this.subscribedEvents = this.socketService.getSubscribedEvents();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  hasPermission(permission: string): boolean {
    return this.permissionService.hasPermission(permission);
  }

  getCurrentRole(): string | null {
    return this.permissionService.getCurrentRole();
  }

  isAdmin(): boolean {
    return this.permissionService.isAdmin();
  }

  isUser(): boolean {
    return this.permissionService.isUser();
  }

  isDevice(): boolean {
    return this.permissionService.isDevice();
  }
}
