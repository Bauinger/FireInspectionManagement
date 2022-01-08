jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IAddress, Address } from '../address.model';
import { AddressService } from '../service/address.service';

import { AddressRoutingResolveService } from './address-routing-resolve.service';

describe('Service Tests', () => {
  describe('Address routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: AddressRoutingResolveService;
    let service: AddressService;
    let resultAddress: IAddress | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(AddressRoutingResolveService);
      service = TestBed.inject(AddressService);
      resultAddress = undefined;
    });

    describe('resolve', () => {
      it('should return IAddress returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAddress = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultAddress).toEqual({ id: 'ABC' });
      });

      it('should return new IAddress if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAddress = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultAddress).toEqual(new Address());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Address })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAddress = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultAddress).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
