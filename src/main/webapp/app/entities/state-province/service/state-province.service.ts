import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStateProvince, NewStateProvince } from '../state-province.model';

export type PartialUpdateStateProvince = Partial<IStateProvince> & Pick<IStateProvince, 'id'>;

export type EntityResponseType = HttpResponse<IStateProvince>;
export type EntityArrayResponseType = HttpResponse<IStateProvince[]>;

@Injectable({ providedIn: 'root' })
export class StateProvinceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/state-provinces');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IStateProvince>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IStateProvince[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  getStateProvinceIdentifier(stateProvince: Pick<IStateProvince, 'id'>): number {
    return stateProvince.id;
  }

  compareStateProvince(o1: Pick<IStateProvince, 'id'> | null, o2: Pick<IStateProvince, 'id'> | null): boolean {
    return o1 && o2 ? this.getStateProvinceIdentifier(o1) === this.getStateProvinceIdentifier(o2) : o1 === o2;
  }

  addStateProvinceToCollectionIfMissing<Type extends Pick<IStateProvince, 'id'>>(
    stateProvinceCollection: Type[],
    ...stateProvincesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const stateProvinces: Type[] = stateProvincesToCheck.filter(isPresent);
    if (stateProvinces.length > 0) {
      const stateProvinceCollectionIdentifiers = stateProvinceCollection.map(
        stateProvinceItem => this.getStateProvinceIdentifier(stateProvinceItem)!
      );
      const stateProvincesToAdd = stateProvinces.filter(stateProvinceItem => {
        const stateProvinceIdentifier = this.getStateProvinceIdentifier(stateProvinceItem);
        if (stateProvinceCollectionIdentifiers.includes(stateProvinceIdentifier)) {
          return false;
        }
        stateProvinceCollectionIdentifiers.push(stateProvinceIdentifier);
        return true;
      });
      return [...stateProvincesToAdd, ...stateProvinceCollection];
    }
    return stateProvinceCollection;
  }
}
