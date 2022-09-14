import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, map, Observable, switchMap, tap } from 'rxjs';

import { CountryService } from '../../country/service/country.service'
import { ICountry } from '../../country/country.model';
import { IStateProvince } from '../state-province.model';
import { ASC, SORT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, StateProvinceService } from '../service/state-province.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-state-province',
  templateUrl: './state-province.component.html',
})
export class StateProvinceComponent implements OnInit {
  countrySelected: ICountry | null = null;
  countries: ICountry[] = [];
  stateProvinces?: IStateProvince[];
  isLoading = false;

  predicate = 'id';
  ascending = true;

  constructor(
    protected stateProvinceService: StateProvinceService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected countryService: CountryService
  ) {}

  trackId = (_index: number, item: IStateProvince): number => this.stateProvinceService.getStateProvinceIdentifier(item);

  ngOnInit(): void {
    this.loadCountries();
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  compareCountry = (o1: ICountry | null, o2: ICountry | null): boolean =>
    this.countryService.compareCountry(o1, o2);

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend())
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.stateProvinces = this.fillComponentAttributesFromResponseBody(response.body);
  }

  protected fillComponentAttributesFromResponseBody(data: IStateProvince[] | null): IStateProvince[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      country: this.countrySelected?.id
    };
    return this.stateProvinceService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected loadCountries(): void {
    this.stateProvinces = [];
    this.countryService
      .query()
      .pipe(map((res: HttpResponse<ICountry[]>) => res.body ?? []))
      .subscribe((stateProvinces: IStateProvince[]) => (this.countries = stateProvinces));
  }
}
