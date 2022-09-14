import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { StateProvinceComponent } from '../list/state-province.component';
import { StateProvinceDetailComponent } from '../detail/state-province-detail.component';
import { StateProvinceRoutingResolveService } from './state-province-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const stateProvinceRoute: Routes = [
  {
    path: '',
    component: StateProvinceComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StateProvinceDetailComponent,
    resolve: {
      stateProvince: StateProvinceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(stateProvinceRoute)],
  exports: [RouterModule],
})
export class StateProvinceRoutingModule {}
