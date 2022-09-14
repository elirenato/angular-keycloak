import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { StateProvinceComponent } from './list/state-province.component';
import { StateProvinceDetailComponent } from './detail/state-province-detail.component';
import { StateProvinceRoutingModule } from './route/state-province-routing.module';

@NgModule({
  imports: [SharedModule, StateProvinceRoutingModule],
  declarations: [StateProvinceComponent, StateProvinceDetailComponent],
})
export class StateProvinceModule {}
