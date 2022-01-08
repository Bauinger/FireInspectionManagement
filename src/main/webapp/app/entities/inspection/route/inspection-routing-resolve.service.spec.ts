jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IInspection, Inspection } from '../inspection.model';
import { InspectionService } from '../service/inspection.service';

import { InspectionRoutingResolveService } from './inspection-routing-resolve.service';

describe('Service Tests', () => {
  describe('Inspection routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: InspectionRoutingResolveService;
    let service: InspectionService;
    let resultInspection: IInspection | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(InspectionRoutingResolveService);
      service = TestBed.inject(InspectionService);
      resultInspection = undefined;
    });

    describe('resolve', () => {
      it('should return IInspection returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultInspection = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultInspection).toEqual({ id: 'ABC' });
      });

      it('should return new IInspection if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultInspection = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultInspection).toEqual(new Inspection());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Inspection })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultInspection = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultInspection).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
