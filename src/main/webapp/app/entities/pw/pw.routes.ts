import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { PWComponent } from './list/pw.component';
import { PWDetailComponent } from './detail/pw-detail.component';
import { PWUpdateComponent } from './update/pw-update.component';
import PWResolve from './route/pw-routing-resolve.service';

const pWRoute: Routes = [
  {
    path: '',
    component: PWComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PWDetailComponent,
    resolve: {
      pW: PWResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PWUpdateComponent,
    resolve: {
      pW: PWResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PWUpdateComponent,
    resolve: {
      pW: PWResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default pWRoute;
