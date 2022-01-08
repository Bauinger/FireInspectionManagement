import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IDefect, Defect } from '../defect.model';

import { DefectService } from './defect.service';

describe('Service Tests', () => {
  describe('Defect Service', () => {
    let service: DefectService;
    let httpMock: HttpTestingController;
    let elemDefault: IDefect;
    let expectedResult: IDefect | IDefect[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(DefectService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 'AAAAAAA',
        defectNr: 'AAAAAAA',
        deadline: currentDate,
        done: false,
        imminentDanger: false,
        title: 'AAAAAAA',
        description: 'AAAAAAA',
        suggestions: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            deadline: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find('ABC').subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Defect', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
            deadline: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            deadline: currentDate,
          },
          returnedFromService
        );

        service.create(new Defect()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Defect', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            defectNr: 'BBBBBB',
            deadline: currentDate.format(DATE_FORMAT),
            done: true,
            imminentDanger: true,
            title: 'BBBBBB',
            description: 'BBBBBB',
            suggestions: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            deadline: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Defect', () => {
        const patchObject = Object.assign(
          {
            done: true,
            imminentDanger: true,
            title: 'BBBBBB',
          },
          new Defect()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            deadline: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Defect', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            defectNr: 'BBBBBB',
            deadline: currentDate.format(DATE_FORMAT),
            done: true,
            imminentDanger: true,
            title: 'BBBBBB',
            description: 'BBBBBB',
            suggestions: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            deadline: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Defect', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addDefectToCollectionIfMissing', () => {
        it('should add a Defect to an empty array', () => {
          const defect: IDefect = { id: 'ABC' };
          expectedResult = service.addDefectToCollectionIfMissing([], defect);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(defect);
        });

        it('should not add a Defect to an array that contains it', () => {
          const defect: IDefect = { id: 'ABC' };
          const defectCollection: IDefect[] = [
            {
              ...defect,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addDefectToCollectionIfMissing(defectCollection, defect);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Defect to an array that doesn't contain it", () => {
          const defect: IDefect = { id: 'ABC' };
          const defectCollection: IDefect[] = [{ id: 'CBA' }];
          expectedResult = service.addDefectToCollectionIfMissing(defectCollection, defect);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(defect);
        });

        it('should add only unique Defect to an array', () => {
          const defectArray: IDefect[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'ba8d9742-7597-4aa1-be76-c4fd503832a3' }];
          const defectCollection: IDefect[] = [{ id: 'ABC' }];
          expectedResult = service.addDefectToCollectionIfMissing(defectCollection, ...defectArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const defect: IDefect = { id: 'ABC' };
          const defect2: IDefect = { id: 'CBA' };
          expectedResult = service.addDefectToCollectionIfMissing([], defect, defect2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(defect);
          expect(expectedResult).toContain(defect2);
        });

        it('should accept null and undefined values', () => {
          const defect: IDefect = { id: 'ABC' };
          expectedResult = service.addDefectToCollectionIfMissing([], null, defect, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(defect);
        });

        it('should return initial array if no Defect is added', () => {
          const defectCollection: IDefect[] = [{ id: 'ABC' }];
          expectedResult = service.addDefectToCollectionIfMissing(defectCollection, undefined, null);
          expect(expectedResult).toEqual(defectCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
