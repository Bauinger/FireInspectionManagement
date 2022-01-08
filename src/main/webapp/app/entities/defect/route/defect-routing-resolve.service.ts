import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDefect, Defect } from '../defect.model';
import { DefectService } from '../service/defect.service';

@Injectable({ providedIn: 'root' })
export class DefectRoutingResolveService implements Resolve<IDefect> {
  constructor(protected service: DefectService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDefect> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((defect: HttpResponse<Defect>) => {
          if (defect.body) {
            return of(defect.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Defect());
  }
}
