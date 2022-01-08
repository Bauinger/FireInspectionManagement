import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDefect, getDefectIdentifier } from '../defect.model';

export type EntityResponseType = HttpResponse<IDefect>;
export type EntityArrayResponseType = HttpResponse<IDefect[]>;

@Injectable({ providedIn: 'root' })
export class DefectService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/defects');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(defect: IDefect): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(defect);
    return this.http
      .post<IDefect>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(defect: IDefect): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(defect);
    return this.http
      .put<IDefect>(`${this.resourceUrl}/${getDefectIdentifier(defect) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(defect: IDefect): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(defect);
    return this.http
      .patch<IDefect>(`${this.resourceUrl}/${getDefectIdentifier(defect) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<IDefect>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDefect[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDefectToCollectionIfMissing(defectCollection: IDefect[], ...defectsToCheck: (IDefect | null | undefined)[]): IDefect[] {
    const defects: IDefect[] = defectsToCheck.filter(isPresent);
    if (defects.length > 0) {
      const defectCollectionIdentifiers = defectCollection.map(defectItem => getDefectIdentifier(defectItem)!);
      const defectsToAdd = defects.filter(defectItem => {
        const defectIdentifier = getDefectIdentifier(defectItem);
        if (defectIdentifier == null || defectCollectionIdentifiers.includes(defectIdentifier)) {
          return false;
        }
        defectCollectionIdentifiers.push(defectIdentifier);
        return true;
      });
      return [...defectsToAdd, ...defectCollection];
    }
    return defectCollection;
  }

  protected convertDateFromClient(defect: IDefect): IDefect {
    return Object.assign({}, defect, {
      deadline: defect.deadline?.isValid() ? defect.deadline.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.deadline = res.body.deadline ? dayjs(res.body.deadline) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((defect: IDefect) => {
        defect.deadline = defect.deadline ? dayjs(defect.deadline) : undefined;
      });
    }
    return res;
  }
}
