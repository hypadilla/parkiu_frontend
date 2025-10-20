import { Pipe, PipeTransform } from '@angular/core';
import { PermissionService } from '../services/permission.service';

@Pipe({
  name: 'hasPermission',
  pure: false // Para que se actualice cuando cambien los permisos
})
export class HasPermissionPipe implements PipeTransform {
  constructor(private permissionService: PermissionService) {}

  transform(permission: string): boolean {
    return this.permissionService.hasPermission(permission);
  }
}
