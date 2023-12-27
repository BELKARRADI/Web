import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITooth, NewTooth } from '../tooth.model';

export type PartialUpdateTooth = Partial<ITooth> & Pick<ITooth, 'id'>;

export type EntityResponseType = HttpResponse<ITooth>;
export type EntityArrayResponseType = HttpResponse<ITooth[]>;

@Injectable({ providedIn: 'root' })
export class ToothService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/teeth');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(tooth: NewTooth): Observable<EntityResponseType> {
    return this.http.post<ITooth>(this.resourceUrl, tooth, { observe: 'response' });
  }

  update(tooth: ITooth): Observable<EntityResponseType> {
    return this.http.put<ITooth>(`${this.resourceUrl}/${this.getToothIdentifier(tooth)}`, tooth, { observe: 'response' });
  }

  partialUpdate(tooth: PartialUpdateTooth): Observable<EntityResponseType> {
    return this.http.patch<ITooth>(`${this.resourceUrl}/${this.getToothIdentifier(tooth)}`, tooth, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITooth>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITooth[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getToothIdentifier(tooth: Pick<ITooth, 'id'>): number {
    return tooth.id;
  }

  compareTooth(o1: Pick<ITooth, 'id'> | null, o2: Pick<ITooth, 'id'> | null): boolean {
    return o1 && o2 ? this.getToothIdentifier(o1) === this.getToothIdentifier(o2) : o1 === o2;
  }

  addToothToCollectionIfMissing<Type extends Pick<ITooth, 'id'>>(
    toothCollection: Type[],
    ...teethToCheck: (Type | null | undefined)[]
  ): Type[] {
    const teeth: Type[] = teethToCheck.filter(isPresent);
    if (teeth.length > 0) {
      const toothCollectionIdentifiers = toothCollection.map(toothItem => this.getToothIdentifier(toothItem)!);
      const teethToAdd = teeth.filter(toothItem => {
        const toothIdentifier = this.getToothIdentifier(toothItem);
        if (toothCollectionIdentifiers.includes(toothIdentifier)) {
          return false;
        }
        toothCollectionIdentifiers.push(toothIdentifier);
        return true;
      });
      return [...teethToAdd, ...toothCollection];
    }
    return toothCollection;
  }
}
