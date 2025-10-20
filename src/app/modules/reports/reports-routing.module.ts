import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { PermissionGuard } from '../../guards/permission.guard';
import { ReportsHomeComponent } from './reports-home/reports-home.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsHomeComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: { permission: 'CAN_VIEW_DASHBOARD' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule {}
