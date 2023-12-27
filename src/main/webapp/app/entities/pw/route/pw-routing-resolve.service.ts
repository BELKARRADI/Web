import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPW } from '../pw.model';
import { PWService } from '../service/pw.service';

export const pWResolve = (route: ActivatedRouteSnapshot): Observable<null | IPW> => {
  const id = route.params['id'];
  if (id) {
    return inject(PWService)
      .find(id)
      .pipe(
        mergeMap((pW: HttpResponse<IPW>) => {
          if (pW.body) {
            return of(pW.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default pWResolve;
