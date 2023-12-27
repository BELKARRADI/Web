import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IStudentPW } from '../student-pw.model';
import { StudentPWService } from '../service/student-pw.service';

export const studentPWResolve = (route: ActivatedRouteSnapshot): Observable<null | IStudentPW> => {
  const id = route.params['id'];
  if (id) {
    return inject(StudentPWService)
      .find(id)
      .pipe(
        mergeMap((studentPW: HttpResponse<IStudentPW>) => {
          if (studentPW.body) {
            return of(studentPW.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default studentPWResolve;
