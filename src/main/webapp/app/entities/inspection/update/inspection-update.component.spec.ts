jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { InspectionService } from '../service/inspection.service';
import { IInspection, Inspection } from '../inspection.model';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { InspectionUpdateComponent } from './inspection-update.component';

describe('Component Tests', () => {
  describe('Inspection Management Update Component', () => {
    let comp: InspectionUpdateComponent;
    let fixture: ComponentFixture<InspectionUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let inspectionService: InspectionService;
    let customerService: CustomerService;
    let userService: UserService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [InspectionUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(InspectionUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(InspectionUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      inspectionService = TestBed.inject(InspectionService);
      customerService = TestBed.inject(CustomerService);
      userService = TestBed.inject(UserService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call tenant query and add missing value', () => {
        const inspection: IInspection = { id: 'CBA' };
        const tenant: ICustomer = { id: 'b46c0ee4-ed83-4ccc-b58b-a0a3d0fc2b7f' };
        inspection.tenant = tenant;

        const tenantCollection: ICustomer[] = [{ id: '378033fa-6b4c-49a4-aa7f-cfeacb4cee1e' }];
        jest.spyOn(customerService, 'query').mockReturnValue(of(new HttpResponse({ body: tenantCollection })));
        const expectedCollection: ICustomer[] = [tenant, ...tenantCollection];
        jest.spyOn(customerService, 'addCustomerToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ inspection });
        comp.ngOnInit();

        expect(customerService.query).toHaveBeenCalled();
        expect(customerService.addCustomerToCollectionIfMissing).toHaveBeenCalledWith(tenantCollection, tenant);
        expect(comp.tenantsCollection).toEqual(expectedCollection);
      });

      it('Should call User query and add missing value', () => {
        const inspection: IInspection = { id: 'CBA' };
        const appraiser: IUser = { id: '73148374-8449-413a-8e01-92e9c483f94f' };
        inspection.appraiser = appraiser;

        const userCollection: IUser[] = [{ id: '0b33d41e-c6c1-40a6-a2d0-96c930a94426' }];
        jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [appraiser];
        const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
        jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ inspection });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const inspection: IInspection = { id: 'CBA' };
        const tenant: ICustomer = { id: '7dbc998c-6559-40ab-9182-6a32443a2f75' };
        inspection.tenant = tenant;
        const appraiser: IUser = { id: '6d20fe26-cec6-40ed-8553-e941b6fdfca4' };
        inspection.appraiser = appraiser;

        activatedRoute.data = of({ inspection });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(inspection));
        expect(comp.tenantsCollection).toContain(tenant);
        expect(comp.usersSharedCollection).toContain(appraiser);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Inspection>>();
        const inspection = { id: 'ABC' };
        jest.spyOn(inspectionService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ inspection });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: inspection }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(inspectionService.update).toHaveBeenCalledWith(inspection);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Inspection>>();
        const inspection = new Inspection();
        jest.spyOn(inspectionService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ inspection });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: inspection }));
        saveSubject.complete();

        // THEN
        expect(inspectionService.create).toHaveBeenCalledWith(inspection);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Inspection>>();
        const inspection = { id: 'ABC' };
        jest.spyOn(inspectionService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ inspection });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(inspectionService.update).toHaveBeenCalledWith(inspection);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackCustomerById', () => {
        it('Should return tracked Customer primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackCustomerById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackUserById', () => {
        it('Should return tracked User primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackUserById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
