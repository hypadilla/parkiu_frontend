import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error: string | null = null;
  
  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;
    
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        // Asegurarse de que todos los usuarios tengan un ID
        this.users = users.filter(user => {
          if (!user.id) {
            console.warn('Usuario sin ID encontrado:', user);
            return false;
          }
          return true;
        });
        
        console.log('Usuarios cargados:', this.users);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.error = 'No se pudieron cargar los usuarios. Por favor, inténtelo de nuevo más tarde.';
        this.loading = false;
      }
    });
  }

  viewUserDetails(userId: string): void {
    if (!userId) {
      console.error('ID de usuario no proporcionado');
      return;
    }
    this.router.navigate(['/users', userId]);
  }

  editUser(userId: string): void {
    if (!userId) {
      console.error('ID de usuario no proporcionado');
      return;
    }
    this.router.navigate(['/users/edit', userId]);
  }
  
  goBack(): void {
    this.router.navigate(['/']);
  }

  createUser(): void {
    this.router.navigate(['/users/new']);
  }

  deleteUser(userId: string): void {
    if (confirm('¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer.')) {
      this.loading = true;
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
          this.error = 'No se pudo eliminar el usuario. Por favor, inténtelo de nuevo más tarde.';
          this.loading = false;
        }
      });
    }
  }
}
