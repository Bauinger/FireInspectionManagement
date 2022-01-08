import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { InspectionStatus } from 'app/entities/enumerations/inspection-status.model';
import { IInspection, Inspection } from '../inspection.model';

import { InspectionService } from './inspection.service';

describe('Service Tests', () => {
  describe('Inspection Service', () => {
    let service: InspectionService;
    let httpMock: HttpTestingController;
    let elemDefault: IInspection;
    let expectedResult: IInspection | IInspection[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(InspectionService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 'AAAAAAA',
        inspectionNr: 'AAAAAAA',
        inspectionStatus: InspectionStatus.OPEN,
        startDateTime: currentDate,
        endDateTime: currentDate,
        note: 'AAAAAAA',
        hasTenantRefused: false,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            startDateTime: currentDate.format(DATE_TIME_FORMAT),
            endDateTime: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find('ABC').subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Inspection', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
            startDateTime: currentDate.format(DATE_TIME_FORMAT),
            endDateTime: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            startDateTime: currentDate,
            endDateTime: currentDate,
          },
          returnedFromService
        );

        service.create(new Inspection()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Inspection', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            inspectionNr: 'BBBBBB',
            inspectionStatus: 'BBBBBB',
            startDateTime: currentDate.format(DATE_TIME_FORMAT),
            endDateTime: currentDate.format(DATE_TIME_FORMAT),
            note: 'BBBBBB',
            hasTenantRefused: true,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            startDateTime: currentDate,
            endDateTime: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Inspection', () => {
        const patchObject = Object.assign(
          {
            startDateTime: currentDate.format(DATE_TIME_FORMAT),
            endDateTime: currentDate.format(DATE_TIME_FORMAT),
            note: 'BBBBBB',
            hasTenantRefused: true,
          },
          new Inspection()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            startDateTime: currentDate,
            endDateTime: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Inspection', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            inspectionNr: 'BBBBBB',
            inspectionStatus: 'BBBBBB',
            startDateTime: currentDate.format(DATE_TIME_FORMAT),
            endDateTime: currentDate.format(DATE_TIME_FORMAT),
            note: 'BBBBBB',
            hasTenantRefused: true,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            startDateTime: currentDate,
            endDateTime: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Inspection', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addInspectionToCollectionIfMissing', () => {
        it('should add a Inspection to an empty array', () => {
          const inspection: IInspection = { id: 'ABC' };
          expectedResult = service.addInspectionToCollectionIfMissing([], inspection);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(inspection);
        });

        it('should not add a Inspection to an array that contains it', () => {
          const inspection: IInspection = { id: 'ABC' };
          const inspectionCollection: IInspection[] = [
            {
              ...inspection,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addInspectionToCollectionIfMissing(inspectionCollection, inspection);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Inspection to an array that doesn't contain it", () => {
          const inspection: IInspection = { id: 'ABC' };
          const inspectionCollection: IInspection[] = [{ id: 'CBA' }];
          expectedResult = service.addInspectionToCollectionIfMissing(inspectionCollection, inspection);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(inspection);
        });

        it('should add only unique Inspection to an array', () => {
          const inspectionArray: IInspection[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: '75cf9855-4e83-48e4-8f67-a18925ea4f30' }];
          const inspectionCollection: IInspection[] = [{ id: 'ABC' }];
          expectedResult = service.addInspectionToCollectionIfMissing(inspectionCollection, ...inspectionArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const inspection: IInspection = { id: 'ABC' };
          const inspection2: IInspection = { id: 'CBA' };
          expectedResult = service.addInspectionToCollectionIfMissing([], inspection, inspection2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(inspection);
          expect(expectedResult).toContain(inspection2);
        });

        it('should accept null and undefined values', () => {
          const inspection: IInspection = { id: 'ABC' };
          expectedResult = service.addInspectionToCollectionIfMissing([], null, inspection, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(inspection);
        });

        it('should return initial array if no Inspection is added', () => {
          const inspectionCollection: IInspection[] = [{ id: 'ABC' }];
          expectedResult = service.addInspectionToCollectionIfMissing(inspectionCollection, undefined, null);
          expect(expectedResult).toEqual(inspectionCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
