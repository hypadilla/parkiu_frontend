import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth.model';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss']
})
export class ProfileModalComponent implements OnInit {
  @Input() userId: string | null = null;
  user: User | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    public activeModal: NgbActiveModal,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Usar el usuario actual desde AuthService si existe
    const current = this.authService.currentUserValue;
    if (current) {
      this.user = current;
      return;
    }
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.loading = true;
    this.error = null;

    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar perfil de usuario:', error);
        this.error = 'No se pudo cargar la información del usuario.';
        this.loading = false;
      }
    });
  }

  close(): void {
    this.activeModal.close();
  }
}
