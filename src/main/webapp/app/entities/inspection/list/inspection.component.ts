import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IInspection } from '../inspection.model';
import { InspectionService } from '../service/inspection.service';
import { InspectionDeleteDialogComponent } from '../delete/inspection-delete-dialog.component';

@Component({
  selector: 'jhi-inspection',
  templateUrl: './inspection.component.html',
})
export class InspectionComponent implements OnInit {
  inspections?: IInspection[];
  isLoading = false;

  constructor(protected inspectionService: InspectionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.inspectionService.query().subscribe(
      (res: HttpResponse<IInspection[]>) => {
        this.isLoading = false;
        this.inspections = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IInspection): string {
    return item.id!;
  }

  delete(inspection: IInspection): void {
    const modalRef = this.modalService.open(InspectionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.inspection = inspection;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
