import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AddressService } from '../service/address.service';

import { AddressComponent } from './address.component';

describe('Component Tests', () => {
  describe('Address Management Component', () => {
    let comp: AddressComponent;
    let fixture: ComponentFixture<AddressComponent>;
    let service: AddressService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AddressComponent],
      })
        .overrideTemplate(AddressComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AddressComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(AddressService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 'ABC' }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.addresses?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
