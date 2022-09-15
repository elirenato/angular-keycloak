import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CustomerFormService, CustomerFormGroup } from './customer-form.service';
import { CountryService } from '../../country/service/country.service'
import { ICountry } from '../../country/country.model';
import { ICustomer } from '../customer.model';
import { CustomerService } from '../service/customer.service';
import { IStateProvince } from 'app/entities/state-province/state-province.model';
import { StateProvinceService } from 'app/entities/state-province/service/state-province.service';

@Component({
  selector: 'jhi-customer-update',
  templateUrl: './customer-update.component.html',
})
export class CustomerUpdateComponent implements OnInit {
  isSaving = false;
  customer: ICustomer | null = null;

  countrySharedCollection: ICountry[] = [];
  stateProvincesSharedCollection: IStateProvince[] = [];

  editForm: CustomerFormGroup = this.customerFormService.createCustomerFormGroup();

  constructor(
    protected customerService: CustomerService,
    protected customerFormService: CustomerFormService,
    protected countryService: CountryService,
    protected stateProvinceService: StateProvinceService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareStateProvince = (o1: IStateProvince | null, o2: IStateProvince | null): boolean =>
    this.stateProvinceService.compareStateProvince(o1, o2);

  compareCountry = (o1: ICountry | null, o2: ICountry | null): boolean =>
    this.countryService.compareCountry(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ customer }) => {
      this.customer = customer;
      if (customer) {
        this.updateForm(customer);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const customer = this.customerFormService.getCustomer(this.editForm);
    if (customer.id !== null) {
      this.subscribeToSaveResponse(this.customerService.update(customer));
    } else {
      this.subscribeToSaveResponse(this.customerService.create(customer));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICustomer>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(customer: ICustomer): void {
    customer.country = customer.stateProvince?.country;
    this.customer = customer;
    this.customerFormService.resetForm(this.editForm, customer);
    this.loadStateProvinces();
  }

  protected loadRelationshipsOptions(): void {
    this.countryService
      .query()
      .pipe(map((res: HttpResponse<IStateProvince[]>) => res.body ?? []))
      .subscribe((countries: ICountry[]) => (this.countrySharedCollection = countries));
  }

  protected loadStateProvinces(): void {
    const country = this.editForm.get('country')!.value;
    this.stateProvincesSharedCollection = [];
    this.stateProvinceService
      .query({
        country: country?.id
      })
      .pipe(map((res: HttpResponse<IStateProvince[]>) => res.body ?? []))
      .subscribe((stateProvinces: IStateProvince[]) => {
        this.stateProvincesSharedCollection = stateProvinces;
      });
  }
}
