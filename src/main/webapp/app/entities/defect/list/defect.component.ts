import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDefect } from '../defect.model';
import { DefectService } from '../service/defect.service';
import { DefectDeleteDialogComponent } from '../delete/defect-delete-dialog.component';

@Component({
  selector: 'jhi-defect',
  templateUrl: './defect.component.html',
})
export class DefectComponent implements OnInit {
  defects?: IDefect[];
  isLoading = false;

  constructor(protected defectService: DefectService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.defectService.query().subscribe(
      (res: HttpResponse<IDefect[]>) => {
        this.isLoading = false;
        this.defects = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IDefect): string {
    return item.id!;
  }

  delete(defect: IDefect): void {
    const modalRef = this.modalService.open(DefectDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.defect = defect;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
