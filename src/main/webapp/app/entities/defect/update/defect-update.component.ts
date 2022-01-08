import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IDefect, Defect } from '../defect.model';
import { DefectService } from '../service/defect.service';
import { IInspection } from 'app/entities/inspection/inspection.model';
import { InspectionService } from 'app/entities/inspection/service/inspection.service';

@Component({
  selector: 'jhi-defect-update',
  templateUrl: './defect-update.component.html',
})
export class DefectUpdateComponent implements OnInit {
  isSaving = false;

  inspectionsSharedCollection: IInspection[] = [];

  editForm = this.fb.group({
    id: [],
    defectNr: [],
    deadline: [],
    done: [],
    imminentDanger: [],
    title: [],
    description: [],
    suggestions: [],
    inspection: [],
  });

  constructor(
    protected defectService: DefectService,
    protected inspectionService: InspectionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ defect }) => {
      this.updateForm(defect);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const defect = this.createFromForm();
    if (defect.id !== undefined) {
      this.subscribeToSaveResponse(this.defectService.update(defect));
    } else {
      this.subscribeToSaveResponse(this.defectService.create(defect));
    }
  }

  trackInspectionById(index: number, item: IInspection): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDefect>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(defect: IDefect): void {
    this.editForm.patchValue({
      id: defect.id,
      defectNr: defect.defectNr,
      deadline: defect.deadline,
      done: defect.done,
      imminentDanger: defect.imminentDanger,
      title: defect.title,
      description: defect.description,
      suggestions: defect.suggestions,
      inspection: defect.inspection,
    });

    this.inspectionsSharedCollection = this.inspectionService.addInspectionToCollectionIfMissing(
      this.inspectionsSharedCollection,
      defect.inspection
    );
  }

  protected loadRelationshipsOptions(): void {
    this.inspectionService
      .query()
      .pipe(map((res: HttpResponse<IInspection[]>) => res.body ?? []))
      .pipe(
        map((inspections: IInspection[]) =>
          this.inspectionService.addInspectionToCollectionIfMissing(inspections, this.editForm.get('inspection')!.value)
        )
      )
      .subscribe((inspections: IInspection[]) => (this.inspectionsSharedCollection = inspections));
  }

  protected createFromForm(): IDefect {
    return {
      ...new Defect(),
      id: this.editForm.get(['id'])!.value,
      defectNr: this.editForm.get(['defectNr'])!.value,
      deadline: this.editForm.get(['deadline'])!.value,
      done: this.editForm.get(['done'])!.value,
      imminentDanger: this.editForm.get(['imminentDanger'])!.value,
      title: this.editForm.get(['title'])!.value,
      description: this.editForm.get(['description'])!.value,
      suggestions: this.editForm.get(['suggestions'])!.value,
      inspection: this.editForm.get(['inspection'])!.value,
    };
  }
}
