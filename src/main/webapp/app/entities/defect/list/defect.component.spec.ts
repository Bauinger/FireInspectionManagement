import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { DefectService } from '../service/defect.service';

import { DefectComponent } from './defect.component';

describe('Component Tests', () => {
  describe('Defect Management Component', () => {
    let comp: DefectComponent;
    let fixture: ComponentFixture<DefectComponent>;
    let service: DefectService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DefectComponent],
      })
        .overrideTemplate(DefectComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DefectComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(DefectService);

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
      expect(comp.defects?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
