import { Inspection } from './../entities/inspection/inspection.model';
import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit, Input } from '@angular/core';
import { isSameDay, isSameMonth } from 'date-fns';
import { Observable, Subject } from 'rxjs';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { IInspection } from 'app/entities/inspection/inspection.model';
import { InspectionService } from 'app/entities/inspection/service/inspection.service';
import { HttpResponse } from '@angular/common/http';
import { ICustomer } from 'app/entities/customer/customer.model';
import { IUser } from 'app/admin/user-management/user-management.model';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from 'app/entities/customer/service/customer.service';
import { UserService } from 'app/entities/user/user.service';
import { finalize, map } from 'rxjs/operators';
import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { Account } from 'app/core/auth/account.model';
import { InspectionStatus } from 'app/entities/enumerations/inspection-status.model';
import { v4 as uuidv4 } from 'uuid';

const colors: any = {
  green: {
    primary: '#00FF00',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'jhi-mwl-calendar-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      h3 {
        margin: 0 0 10px;
      }

      pre {
        background-color: #f5f5f5;
        padding: 15px;
      }
    `,
  ],
  templateUrl: './mwl-calendar.component.html',
})
export class MwlCalendarComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any> | undefined;

  inspections?: IInspection[];

  inspection?: IInspection;

  isLoading = false;

  view: CalendarView = CalendarView.Week;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData:
    | {
        action: string;
        event: CalendarEvent;
      }
    | undefined;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.updateEvent(event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.deleteEvent(event);
      },
    },
  ];

  refresh = new Subject<void>();

  events: CalendarEvent<Inspection>[] = [];

  activeDayIsOpen = false;

  isSaving = false;

  details = false;

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

  badageColor = 'badge rounded-pill bg-primary';

  @Input() account: Account | null = null;

  constructor(
    private modal: NgbModal,
    protected inspectionService: InspectionService,
    protected customerService: CustomerService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected config: NgbModalConfig
  ) {
    config.backdrop = 'static';
  }

  ngOnInit(): void {
    this.loadInspections();
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        if (iEvent.meta) {
          iEvent.meta.startDateTime = dayjs(newStart);
          iEvent.meta.endDateTime = dayjs(newEnd);
        }
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.save();
    this.loadInspections();
  }

  addEvent(): void {
    const today = dayjs().startOf('day');
    const inspection: Inspection = new Inspection();
    inspection.inspectionNr = uuidv4();
    inspection.inspectionStatus = InspectionStatus.OPEN;
    inspection.startDateTime = today;
    inspection.endDateTime = today;
    inspection.note = '';
    inspection.hasTenantRefused = false;
    this.updateForm(inspection);
    this.loadRelationshipsOptions();
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  closeOpenMonthViewDay(): void {
    this.activeDayIsOpen = false;
  }

  clickedEvent(clickedEvent: CalendarEvent): void {
    this.inspection = clickedEvent.meta;
    if (this.inspection?.inspectionStatus === InspectionStatus.POSTPONED) {
      this.badageColor = 'badge rounded-pill bg-warning';
    } else if (this.inspection?.inspectionStatus === InspectionStatus.DONE) {
      this.badageColor = 'badge rounded-pill bg-success';
    }
  }

  setView(view: CalendarView): void {
    this.view = view;
  }

  save(): void {
    this.isSaving = true;
    const inspection = this.createFromForm();
    if (inspection.id !== undefined) {
      this.subscribeToSaveResponse(this.inspectionService.update(inspection));
    } else {
      this.subscribeToSaveResponse(this.inspectionService.create(inspection));
    }
    this.loadInspections();
    close();
  }

  trackCustomerById(index: number, item: ICustomer): string {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected updateEvent(eventToUpdate: CalendarEvent): void {
    const inspection: Inspection = eventToUpdate.meta;
    this.updateForm(inspection);
    this.loadRelationshipsOptions();
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  protected deleteEvent(eventToDelete: CalendarEvent): void {
    this.events = this.events.filter(event => event !== eventToDelete);
    const id = eventToDelete.id as string;
    this.inspectionService.delete(id);
  }

  protected loadInspections(): void {
    this.isLoading = true;
    this.inspectionService.query().subscribe(
      (res: HttpResponse<IInspection[]>) => {
        this.isLoading = false;
        this.inspections = res.body ?? [];
        this.inspections = this.inspections.filter(inspection => inspection.appraiser?.login === this.account?.login);
        this.events = [];
        this.inspections.forEach(inspection => {
          const actions = this.actions;
          let color = colors.blue;
          if (inspection.inspectionStatus === InspectionStatus.DONE) {
            color = colors.green;
          } else if (inspection.inspectionStatus === InspectionStatus.POSTPONED) {
            color = colors.yellow;
          }
          this.events = [
            ...this.events,
            {
              id: inspection.id,
              title: 'New event',
              start: inspection.endDateTime?.toDate() as Date,
              end: inspection.endDateTime?.toDate(),
              actions,
              color,
              allDay: false,
              draggable: true,
              resizable: {
                beforeStart: true,
                afterEnd: true,
              },
              meta: inspection,
            },
          ];
        });
      },
      () => {
        this.isLoading = false;
      }
    );
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
    throw Error('error');
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  protected previousState(): void {
    close();
    // window.history.back();
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
}
