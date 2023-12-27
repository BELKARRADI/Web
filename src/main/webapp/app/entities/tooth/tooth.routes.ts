import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ToothComponent } from './list/tooth.component';
import { ToothDetailComponent } from './detail/tooth-detail.component';
import { ToothUpdateComponent } from './update/tooth-update.component';
import ToothResolve from './route/tooth-routing-resolve.service';

const toothRoute: Routes = [
  {
    path: '',
    component: ToothComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ToothDetailComponent,
    resolve: {
      tooth: ToothResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ToothUpdateComponent,
    resolve: {
      tooth: ToothResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ToothUpdateComponent,
    resolve: {
      tooth: ToothResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default toothRoute;
