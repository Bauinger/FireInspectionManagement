import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'address',
        data: { pageTitle: 'fireApp.address.home.title' },
        loadChildren: () => import('./address/address.module').then(m => m.AddressModule),
      },
      {
        path: 'customer',
        data: { pageTitle: 'fireApp.customer.home.title' },
        loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
      },
      {
        path: 'inspection',
        data: { pageTitle: 'fireApp.inspection.home.title' },
        loadChildren: () => import('./inspection/inspection.module').then(m => m.InspectionModule),
      },
      {
        path: 'defect',
        data: { pageTitle: 'fireApp.defect.home.title' },
        loadChildren: () => import('./defect/defect.module').then(m => m.DefectModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
