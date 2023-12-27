import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITooth } from '../tooth.model';
import { ToothService } from '../service/tooth.service';

export const toothResolve = (route: ActivatedRouteSnapshot): Observable<null | ITooth> => {
  const id = route.params['id'];
  if (id) {
    return inject(ToothService)
      .find(id)
      .pipe(
        mergeMap((tooth: HttpResponse<ITooth>) => {
          if (tooth.body) {
            return of(tooth.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default toothResolve;
