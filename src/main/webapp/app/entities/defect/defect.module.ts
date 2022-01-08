import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DefectComponent } from './list/defect.component';
import { DefectDetailComponent } from './detail/defect-detail.component';
import { DefectUpdateComponent } from './update/defect-update.component';
import { DefectDeleteDialogComponent } from './delete/defect-delete-dialog.component';
import { DefectRoutingModule } from './route/defect-routing.module';

@NgModule({
  imports: [SharedModule, DefectRoutingModule],
  declarations: [DefectComponent, DefectDetailComponent, DefectUpdateComponent, DefectDeleteDialogComponent],
  entryComponents: [DefectDeleteDialogComponent],
})
export class DefectModule {}
