import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IStateProvince } from '../state-province.model';
import { StateProvinceService } from '../service/state-province.service';

@Injectable({ providedIn: 'root' })
export class StateProvinceRoutingResolveService implements Resolve<IStateProvince | null> {
  constructor(protected service: StateProvinceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IStateProvince | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((stateProvince: HttpResponse<IStateProvince>) => {
          if (stateProvince.body) {
            return of(stateProvince.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
