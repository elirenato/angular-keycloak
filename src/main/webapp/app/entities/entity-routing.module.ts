import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Authority } from '../config/authority.constants';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'country',
        data: {
          pageTitle: 'angularkeycloakApp.country.home.title',
          authorities: [Authority.MANAGERS, Authority.OPERATORS],
        },
        loadChildren: () => import('./country/country.module').then(m => m.CountryModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
