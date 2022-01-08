jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CustomerService } from '../service/customer.service';
import { ICustomer, Customer } from '../customer.model';
import { IAddress } from 'app/entities/address/address.model';
import { AddressService } from 'app/entities/address/service/address.service';

import { CustomerUpdateComponent } from './customer-update.component';

describe('Component Tests', () => {
  describe('Customer Management Update Component', () => {
    let comp: CustomerUpdateComponent;
    let fixture: ComponentFixture<CustomerUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let customerService: CustomerService;
    let addressService: AddressService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CustomerUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CustomerUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CustomerUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      customerService = TestBed.inject(CustomerService);
      addressService = TestBed.inject(AddressService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call address query and add missing value', () => {
        const customer: ICustomer = { id: 'CBA' };
        const address: IAddress = { id: '026bfccd-657f-41c1-b214-2caff8167044' };
        customer.address = address;

        const addressCollection: IAddress[] = [{ id: '5389009f-1076-4571-af36-18f444efcadd' }];
        jest.spyOn(addressService, 'query').mockReturnValue(of(new HttpResponse({ body: addressCollection })));
        const expectedCollection: IAddress[] = [address, ...addressCollection];
        jest.spyOn(addressService, 'addAddressToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ customer });
        comp.ngOnInit();

        expect(addressService.query).toHaveBeenCalled();
        expect(addressService.addAddressToCollectionIfMissing).toHaveBeenCalledWith(addressCollection, address);
        expect(comp.addressesCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const customer: ICustomer = { id: 'CBA' };
        const address: IAddress = { id: '60ff8660-aca2-4748-954c-9237f97ff781' };
        customer.address = address;

        activatedRoute.data = of({ customer });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(customer));
        expect(comp.addressesCollection).toContain(address);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Customer>>();
        const customer = { id: 'ABC' };
        jest.spyOn(customerService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ customer });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: customer }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(customerService.update).toHaveBeenCalledWith(customer);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Customer>>();
        const customer = new Customer();
        jest.spyOn(customerService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ customer });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: customer }));
        saveSubject.complete();

        // THEN
        expect(customerService.create).toHaveBeenCalledWith(customer);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Customer>>();
        const customer = { id: 'ABC' };
        jest.spyOn(customerService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ customer });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(customerService.update).toHaveBeenCalledWith(customer);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackAddressById', () => {
        it('Should return tracked Address primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackAddressById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
