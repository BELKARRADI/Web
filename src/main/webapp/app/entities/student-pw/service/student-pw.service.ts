import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStudentPW, NewStudentPW } from '../student-pw.model';

export type PartialUpdateStudentPW = Partial<IStudentPW> & Pick<IStudentPW, 'id'>;

type RestOf<T extends IStudentPW | NewStudentPW> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestStudentPW = RestOf<IStudentPW>;

export type NewRestStudentPW = RestOf<NewStudentPW>;

export type PartialUpdateRestStudentPW = RestOf<PartialUpdateStudentPW>;

export type EntityResponseType = HttpResponse<IStudentPW>;
export type EntityArrayResponseType = HttpResponse<IStudentPW[]>;

@Injectable({ providedIn: 'root' })
export class StudentPWService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/student-pws');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(studentPW: NewStudentPW): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(studentPW);
    return this.http
      .post<RestStudentPW>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(studentPW: IStudentPW): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(studentPW);
    return this.http
      .put<RestStudentPW>(`${this.resourceUrl}/${this.getStudentPWIdentifier(studentPW)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(studentPW: PartialUpdateStudentPW): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(studentPW);
    return this.http
      .patch<RestStudentPW>(`${this.resourceUrl}/${this.getStudentPWIdentifier(studentPW)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestStudentPW>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestStudentPW[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getStudentPWIdentifier(studentPW: Pick<IStudentPW, 'id'>): number {
    return studentPW.id;
  }

  compareStudentPW(o1: Pick<IStudentPW, 'id'> | null, o2: Pick<IStudentPW, 'id'> | null): boolean {
    return o1 && o2 ? this.getStudentPWIdentifier(o1) === this.getStudentPWIdentifier(o2) : o1 === o2;
  }

  addStudentPWToCollectionIfMissing<Type extends Pick<IStudentPW, 'id'>>(
    studentPWCollection: Type[],
    ...studentPWSToCheck: (Type | null | undefined)[]
  ): Type[] {
    const studentPWS: Type[] = studentPWSToCheck.filter(isPresent);
    if (studentPWS.length > 0) {
      const studentPWCollectionIdentifiers = studentPWCollection.map(studentPWItem => this.getStudentPWIdentifier(studentPWItem)!);
      const studentPWSToAdd = studentPWS.filter(studentPWItem => {
        const studentPWIdentifier = this.getStudentPWIdentifier(studentPWItem);
        if (studentPWCollectionIdentifiers.includes(studentPWIdentifier)) {
          return false;
        }
        studentPWCollectionIdentifiers.push(studentPWIdentifier);
        return true;
      });
      return [...studentPWSToAdd, ...studentPWCollection];
    }
    return studentPWCollection;
  }

  protected convertDateFromClient<T extends IStudentPW | NewStudentPW | PartialUpdateStudentPW>(studentPW: T): RestOf<T> {
    return {
      ...studentPW,
      date: studentPW.date?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restStudentPW: RestStudentPW): IStudentPW {
    return {
      ...restStudentPW,
      date: restStudentPW.date ? dayjs(restStudentPW.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestStudentPW>): HttpResponse<IStudentPW> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestStudentPW[]>): HttpResponse<IStudentPW[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
