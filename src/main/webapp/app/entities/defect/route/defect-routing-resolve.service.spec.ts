jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IDefect, Defect } from '../defect.model';
import { DefectService } from '../service/defect.service';

import { DefectRoutingResolveService } from './defect-routing-resolve.service';

describe('Service Tests', () => {
  describe('Defect routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: DefectRoutingResolveService;
    let service: DefectService;
    let resultDefect: IDefect | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(DefectRoutingResolveService);
      service = TestBed.inject(DefectService);
      resultDefect = undefined;
    });

    describe('resolve', () => {
      it('should return IDefect returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDefect = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultDefect).toEqual({ id: 'ABC' });
      });

      it('should return new IDefect if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDefect = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultDefect).toEqual(new Defect());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Defect })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDefect = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultDefect).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
