import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DefectDetailComponent } from './defect-detail.component';

describe('Component Tests', () => {
  describe('Defect Management Detail Component', () => {
    let comp: DefectDetailComponent;
    let fixture: ComponentFixture<DefectDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [DefectDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ defect: { id: 'ABC' } }) },
          },
        ],
      })
        .overrideTemplate(DefectDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DefectDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load defect on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.defect).toEqual(expect.objectContaining({ id: 'ABC' }));
      });
    });
  });
});
