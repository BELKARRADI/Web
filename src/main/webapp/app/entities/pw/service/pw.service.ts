import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPW, NewPW } from '../pw.model';

export type PartialUpdatePW = Partial<IPW> & Pick<IPW, 'id'>;

export type EntityResponseType = HttpResponse<IPW>;
export type EntityArrayResponseType = HttpResponse<IPW[]>;

@Injectable({ providedIn: 'root' })
export class PWService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pws');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(pW: NewPW): Observable<EntityResponseType> {
    return this.http.post<IPW>(this.resourceUrl, pW, { observe: 'response' });
  }

  update(pW: IPW): Observable<EntityResponseType> {
    return this.http.put<IPW>(`${this.resourceUrl}/${this.getPWIdentifier(pW)}`, pW, { observe: 'response' });
  }

  partialUpdate(pW: PartialUpdatePW): Observable<EntityResponseType> {
    return this.http.patch<IPW>(`${this.resourceUrl}/${this.getPWIdentifier(pW)}`, pW, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPW>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPW[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPWIdentifier(pW: Pick<IPW, 'id'>): number {
    return pW.id;
  }

  comparePW(o1: Pick<IPW, 'id'> | null, o2: Pick<IPW, 'id'> | null): boolean {
    return o1 && o2 ? this.getPWIdentifier(o1) === this.getPWIdentifier(o2) : o1 === o2;
  }

  addPWToCollectionIfMissing<Type extends Pick<IPW, 'id'>>(pWCollection: Type[], ...pWSToCheck: (Type | null | undefined)[]): Type[] {
    const pWS: Type[] = pWSToCheck.filter(isPresent);
    if (pWS.length > 0) {
      const pWCollectionIdentifiers = pWCollection.map(pWItem => this.getPWIdentifier(pWItem)!);
      const pWSToAdd = pWS.filter(pWItem => {
        const pWIdentifier = this.getPWIdentifier(pWItem);
        if (pWCollectionIdentifiers.includes(pWIdentifier)) {
          return false;
        }
        pWCollectionIdentifiers.push(pWIdentifier);
        return true;
      });
      return [...pWSToAdd, ...pWCollection];
    }
    return pWCollection;
  }
}
