jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { DefectService } from '../service/defect.service';
import { IDefect, Defect } from '../defect.model';
import { IInspection } from 'app/entities/inspection/inspection.model';
import { InspectionService } from 'app/entities/inspection/service/inspection.service';

import { DefectUpdateComponent } from './defect-update.component';

describe('Component Tests', () => {
  describe('Defect Management Update Component', () => {
    let comp: DefectUpdateComponent;
    let fixture: ComponentFixture<DefectUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let defectService: DefectService;
    let inspectionService: InspectionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DefectUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(DefectUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DefectUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      defectService = TestBed.inject(DefectService);
      inspectionService = TestBed.inject(InspectionService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Inspection query and add missing value', () => {
        const defect: IDefect = { id: 'CBA' };
        const inspection: IInspection = { id: '4b4e4a0f-74f3-4d8c-afb6-745e6ed312fd' };
        defect.inspection = inspection;

        const inspectionCollection: IInspection[] = [{ id: 'a007e252-4312-452f-b359-e4f985b2a11c' }];
        jest.spyOn(inspectionService, 'query').mockReturnValue(of(new HttpResponse({ body: inspectionCollection })));
        const additionalInspections = [inspection];
        const expectedCollection: IInspection[] = [...additionalInspections, ...inspectionCollection];
        jest.spyOn(inspectionService, 'addInspectionToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ defect });
        comp.ngOnInit();

        expect(inspectionService.query).toHaveBeenCalled();
        expect(inspectionService.addInspectionToCollectionIfMissing).toHaveBeenCalledWith(inspectionCollection, ...additionalInspections);
        expect(comp.inspectionsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const defect: IDefect = { id: 'CBA' };
        const inspection: IInspection = { id: '4d72013a-7c93-4da5-87ed-5ee60f0019b4' };
        defect.inspection = inspection;

        activatedRoute.data = of({ defect });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(defect));
        expect(comp.inspectionsSharedCollection).toContain(inspection);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Defect>>();
        const defect = { id: 'ABC' };
        jest.spyOn(defectService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ defect });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: defect }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(defectService.update).toHaveBeenCalledWith(defect);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Defect>>();
        const defect = new Defect();
        jest.spyOn(defectService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ defect });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: defect }));
        saveSubject.complete();

        // THEN
        expect(defectService.create).toHaveBeenCalledWith(defect);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Defect>>();
        const defect = { id: 'ABC' };
        jest.spyOn(defectService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ defect });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(defectService.update).toHaveBeenCalledWith(defect);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackInspectionById', () => {
        it('Should return tracked Inspection primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackInspectionById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
