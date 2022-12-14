import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, Observable, switchMap, tap } from 'rxjs';

import { CountryService } from '../../country/service/country.service';
import { ICountry } from '../../country/country.model';
import { IStateProvince } from '../state-province.model';
import { ASC, DESC, SORT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, StateProvinceService } from '../service/state-province.service';
import { SortService } from 'app/shared/sort/sort.service';

@Component({
  selector: 'jhi-state-province',
  templateUrl: './state-province.component.html',
})
export class StateProvinceComponent implements OnInit {
  countryID: number | null = null;
  countries: ICountry[] = [];
  stateProvinces?: IStateProvince[] | null;
  isLoading = false;

  predicate = 'id';
  ascending = true;

  constructor(
    protected countryService: CountryService,
    protected stateProvinceService: StateProvinceService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService
  ) {}

  trackId = (_index: number, item: IStateProvince): number => this.stateProvinceService.getStateProvinceIdentifier(item);

  ngOnInit(): void {
    this.load();
  }

  loadStateProvinces(): void {
    this.loadStateProvincesFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  protected loadStateProvincesFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend())
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
    const country = params.get('country');
    this.countryID = country ? Number(country) : null;
    this.stateProvinces = null;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.stateProvinces = this.refineData(dataFromBody);
  }

  protected refineData(data: ICountry[]): ICountry[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IStateProvince[] | null): IStateProvince[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    if (this.countryID) {
      this.isLoading = true;
      const queryObject = {
        country: this.countryID,
      };
      return this.stateProvinceService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
    } else {
      return new Observable<EntityArrayResponseType>();
    }
  }

  protected handleNavigation(predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      sort: this.getSortQueryParam(predicate, ascending),
      country: this.countryID,
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }

  protected load(): void {
    this.loadCountriesFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.countries = this.fillComponentAttributesFromResponseBody(res.body);
        if (this.countryID) {
          this.loadStateProvinces();
        }
      },
    });
  }

  protected loadCountriesFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.countryService.query())
    );
  }
}
