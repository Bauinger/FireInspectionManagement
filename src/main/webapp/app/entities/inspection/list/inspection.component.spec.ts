import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { InspectionService } from '../service/inspection.service';

import { InspectionComponent } from './inspection.component';

describe('Component Tests', () => {
  describe('Inspection Management Component', () => {
    let comp: InspectionComponent;
    let fixture: ComponentFixture<InspectionComponent>;
    let service: InspectionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [InspectionComponent],
      })
        .overrideTemplate(InspectionComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(InspectionComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(InspectionService);

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
      expect(comp.inspections?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
