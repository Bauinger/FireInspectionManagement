import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DefectComponent } from '../list/defect.component';
import { DefectDetailComponent } from '../detail/defect-detail.component';
import { DefectUpdateComponent } from '../update/defect-update.component';
import { DefectRoutingResolveService } from './defect-routing-resolve.service';

const defectRoute: Routes = [
  {
    path: '',
    component: DefectComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DefectDetailComponent,
    resolve: {
      defect: DefectRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DefectUpdateComponent,
    resolve: {
      defect: DefectRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DefectUpdateComponent,
    resolve: {
      defect: DefectRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(defectRoute)],
  exports: [RouterModule],
})
export class DefectRoutingModule {}
