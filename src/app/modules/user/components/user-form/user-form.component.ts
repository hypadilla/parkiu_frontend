import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { User, UserRegistration, UserUpdate } from '../../../../models/user.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  userId: string | null = null;
  isEditMode = false;
  loading = false;
  submitting = false;
  error: string | null = null;
  
  availableRoles = ['ADMIN', 'USER', 'OPERATOR', 'GUEST'];
  availablePermissions = [
    'CAN_CREATE_USERS',
    'CAN_UPDATE_USERS',
    'CAN_DELETE_USERS',
    'CAN_VIEW_USERS'
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.userId = id;
        this.isEditMode = true;
        this.loadUserData(id);
      }
    });
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      role: ['USER', Validators.required],
      permissions: this.fb.array([])
    });
    
    // Si estamos en modo edición, el campo username no es editable
    if (this.isEditMode) {
      this.userForm.get('username')?.disable();
    }
  }

  private loadUserData(userId: string): void {
    this.loading = true;
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.updateForm(user);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar datos del usuario:', error);
        this.error = 'No se pudieron cargar los datos del usuario. Por favor, inténtelo de nuevo más tarde.';
        this.loading = false;
      }
    });
  }

  private updateForm(user: User): void {
    // Actualizar los campos del formulario con los datos del usuario
    this.userForm.patchValue({
      username: user.username,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      role: user.role
    });
    
    // Actualizar los permisos
    this.clearPermissions();
    user.permissions.forEach(permission => {
      this.addPermission(permission);
    });
  }

  get permissionsArray(): FormArray {
    return this.userForm.get('permissions') as FormArray;
  }

  addPermission(permission: string = ''): void {
    this.permissionsArray.push(this.fb.control(permission));
  }

  removePermission(index: number): void {
    this.permissionsArray.removeAt(index);
  }

  clearPermissions(): void {
    while (this.permissionsArray.length) {
      this.permissionsArray.removeAt(0);
    }
  }

  togglePermission(permission: string): void {
    const index = this.getPermissionIndex(permission);
    if (index === -1) {
      this.addPermission(permission);
    } else {
      this.removePermission(index);
    }
  }

  isPermissionSelected(permission: string): boolean {
    return this.getPermissionIndex(permission) !== -1;
  }

  private getPermissionIndex(permission: string): number {
    return this.permissionsArray.controls.findIndex(
      control => control.value === permission
    );
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.userForm.controls).forEach(key => {
        const control = this.userForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    
    if (this.isEditMode && this.userId) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  private createUser(): void {
    const userData: UserRegistration = this.userForm.value;
    
    this.userService.registerUser(userData).subscribe({
      next: () => {
        this.router.navigate(['/users']);
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
        this.error = 'No se pudo crear el usuario. Por favor, inténtelo de nuevo más tarde.';
        this.submitting = false;
      }
    });
  }

  private updateUser(): void {
    if (!this.userId) return;
    
    // Filtrar solo los campos que se han modificado
    const formValue = this.userForm.value;
    const userData: UserUpdate = {};
    
    if (this.userForm.get('email')?.dirty) {
      userData.email = formValue.email;
    }
    
    if (this.userForm.get('name')?.dirty) {
      userData.name = formValue.name;
    }
    
    if (this.userForm.get('lastName')?.dirty) {
      userData.lastName = formValue.lastName;
    }
    
    if (this.userForm.get('role')?.dirty) {
      userData.role = formValue.role;
    }
    
    if (this.userForm.get('permissions')?.dirty) {
      userData.permissions = formValue.permissions;
    }
    
    if (this.userForm.get('password')?.dirty && formValue.password) {
      userData.password = formValue.password;
    }
    
    this.userService.updateUser(this.userId, userData).subscribe({
      next: () => {
        this.router.navigate(['/users']);
      },
      error: (error) => {
        console.error('Error al actualizar usuario:', error);
        this.error = 'No se pudo actualizar el usuario. Por favor, inténtelo de nuevo más tarde.';
        this.submitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }
}
