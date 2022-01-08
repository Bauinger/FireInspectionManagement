jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AddressService } from '../service/address.service';
import { IAddress, Address } from '../address.model';

import { AddressUpdateComponent } from './address-update.component';

describe('Component Tests', () => {
  describe('Address Management Update Component', () => {
    let comp: AddressUpdateComponent;
    let fixture: ComponentFixture<AddressUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let addressService: AddressService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AddressUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AddressUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AddressUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      addressService = TestBed.inject(AddressService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const address: IAddress = { id: 'CBA' };

        activatedRoute.data = of({ address });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(address));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Address>>();
        const address = { id: 'ABC' };
        jest.spyOn(addressService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ address });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: address }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(addressService.update).toHaveBeenCalledWith(address);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Address>>();
        const address = new Address();
        jest.spyOn(addressService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ address });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: address }));
        saveSubject.complete();

        // THEN
        expect(addressService.create).toHaveBeenCalledWith(address);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Address>>();
        const address = { id: 'ABC' };
        jest.spyOn(addressService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ address });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(addressService.update).toHaveBeenCalledWith(address);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
