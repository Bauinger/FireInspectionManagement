import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IInspection, Inspection } from '../inspection.model';
import { InspectionService } from '../service/inspection.service';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-inspection-update',
  templateUrl: './inspection-update.component.html',
})
export class InspectionUpdateComponent implements OnInit {
  isSaving = false;

  tenantsCollection: ICustomer[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    inspectionNr: [],
    inspectionStatus: [],
    startDateTime: [],
    endDateTime: [],
    note: [],
    hasTenantRefused: [],
    tenant: [],
    appraiser: [],
  });

  constructor(
    protected inspectionService: InspectionService,
    protected customerService: CustomerService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ inspection }) => {
      if (inspection.id === undefined) {
        const today = dayjs().startOf('day');
        inspection.startDateTime = today;
        inspection.endDateTime = today;
      }

      this.updateForm(inspection);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const inspection = this.createFromForm();
    if (inspection.id !== undefined) {
      this.subscribeToSaveResponse(this.inspectionService.update(inspection));
    } else {
      this.subscribeToSaveResponse(this.inspectionService.create(inspection));
    }
  }

  trackCustomerById(index: number, item: ICustomer): string {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInspection>>): void {
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

  protected updateForm(inspection: IInspection): void {
    this.editForm.patchValue({
      id: inspection.id,
      inspectionNr: inspection.inspectionNr,
      inspectionStatus: inspection.inspectionStatus,
      startDateTime: inspection.startDateTime ? inspection.startDateTime.format(DATE_TIME_FORMAT) : null,
      endDateTime: inspection.endDateTime ? inspection.endDateTime.format(DATE_TIME_FORMAT) : null,
      note: inspection.note,
      hasTenantRefused: inspection.hasTenantRefused,
      tenant: inspection.tenant,
      appraiser: inspection.appraiser,
    });

    this.tenantsCollection = this.customerService.addCustomerToCollectionIfMissing(this.tenantsCollection, inspection.tenant);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, inspection.appraiser);
  }

  protected loadRelationshipsOptions(): void {
    this.customerService
      .query({ filter: 'inspection-is-null' })
      .pipe(map((res: HttpResponse<ICustomer[]>) => res.body ?? []))
      .pipe(
        map((customers: ICustomer[]) =>
          this.customerService.addCustomerToCollectionIfMissing(customers, this.editForm.get('tenant')!.value)
        )
      )
      .subscribe((customers: ICustomer[]) => (this.tenantsCollection = customers));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('appraiser')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IInspection {
    return {
      ...new Inspection(),
      id: this.editForm.get(['id'])!.value,
      inspectionNr: this.editForm.get(['inspectionNr'])!.value,
      inspectionStatus: this.editForm.get(['inspectionStatus'])!.value,
      startDateTime: this.editForm.get(['startDateTime'])!.value
        ? dayjs(this.editForm.get(['startDateTime'])!.value, DATE_TIME_FORMAT)
        : undefined,
      endDateTime: this.editForm.get(['endDateTime'])!.value
        ? dayjs(this.editForm.get(['endDateTime'])!.value, DATE_TIME_FORMAT)
        : undefined,
      note: this.editForm.get(['note'])!.value,
      hasTenantRefused: this.editForm.get(['hasTenantRefused'])!.value,
      tenant: this.editForm.get(['tenant'])!.value,
      appraiser: this.editForm.get(['appraiser'])!.value,
    };
  }
}
