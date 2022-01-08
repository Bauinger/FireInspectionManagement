import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDefect } from '../defect.model';
import { DefectService } from '../service/defect.service';

@Component({
  templateUrl: './defect-delete-dialog.component.html',
})
export class DefectDeleteDialogComponent {
  defect?: IDefect;

  constructor(protected defectService: DefectService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.defectService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
