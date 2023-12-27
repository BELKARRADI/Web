import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { StudentPWComponent } from './list/student-pw.component';
import { StudentPWDetailComponent } from './detail/student-pw-detail.component';
import { StudentPWUpdateComponent } from './update/student-pw-update.component';
import StudentPWResolve from './route/student-pw-routing-resolve.service';

const studentPWRoute: Routes = [
  {
    path: '',
    component: StudentPWComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StudentPWDetailComponent,
    resolve: {
      studentPW: StudentPWResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StudentPWUpdateComponent,
    resolve: {
      studentPW: StudentPWResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StudentPWUpdateComponent,
    resolve: {
      studentPW: StudentPWResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default studentPWRoute;
