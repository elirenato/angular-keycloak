import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CountryComponent } from './list/country.component';
import { CountryDetailComponent } from './detail/country-detail.component';
import { CountryRoutingModule } from './route/country-routing.module';

@NgModule({
  imports: [SharedModule, CountryRoutingModule],
  declarations: [CountryComponent, CountryDetailComponent],
})
export class CountryModule {}
