import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  user: User | null = null;
  loading = false;
  error: string | null = null;
  
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadUserData(id);
      } else {
        this.error = 'ID de usuario no proporcionado.';
      }
    });
  }

  loadUserData(userId: string): void {
    this.loading = true;
    this.error = null;
    
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar datos del usuario:', error);
        this.error = 'No se pudieron cargar los datos del usuario. Por favor, inténtelo de nuevo más tarde.';
        this.loading = false;
      }
    });
  }

  editUser(): void {
    if (this.user?.id) {
      this.router.navigate(['/users/edit', this.user.id]);
    }
  }

  deleteUser(): void {
    if (!this.user?.id) return;
    
    if (confirm('¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer.')) {
      this.loading = true;
      this.userService.deleteUser(this.user.id).subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
          this.error = 'No se pudo eliminar el usuario. Por favor, inténtelo de nuevo más tarde.';
          this.loading = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
